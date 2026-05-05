const { s3, blobServiceClient } = require('../config/cloudConfig');
const Task = require('../models/Task');
const User = require('../models/User');

// CREATE TASK: Uploads to AWS and schedules Azure sync
exports.createTask = async (req, res) => {
    try {
        const { title, description, userId } = req.body;
        const file = req.file;
        if (!file) return res.status(400).json({ error: "File upload is required" });

        const fileName = `${Date.now()}-${file.originalname}`;

        // 1. Upload to AWS (or generate mock URL)
        let awsUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
        
        if (process.env.AWS_ACCESS_KEY_ID !== 'your_aws_key') {
            const awsParams = {
                Bucket: process.env.AWS_S3_BUCKET_NAME,
                Key: fileName,
                Body: file.buffer,
                ContentType: file.mimetype
            };
            const awsData = await s3.upload(awsParams).promise();
            awsUrl = awsData.Location;
        }

        const newTask = await Task.create({
            userId, title, description, aws_url: awsUrl, sync_status: 'Pending'
        });

        res.status(201).json({ message: "Uploaded to Primary. Azure sync started...", task: newTask });

        // 2. The 1-Minute Replication Logic
        setTimeout(async () => {
            try {
                let azureUrl = `https://${process.env.AZURE_CONTAINER_NAME}.blob.core.windows.net/${fileName}`;

                if (blobServiceClient) {
                    const containerClient = blobServiceClient.getContainerClient(process.env.AZURE_CONTAINER_NAME);
                    const blockBlobClient = containerClient.getBlockBlobClient(fileName);
                    await blockBlobClient.upload(file.buffer, file.buffer.length);
                    azureUrl = blockBlobClient.url;
                }

                await Task.findByIdAndUpdate(newTask._id, {
                    azure_url: azureUrl,
                    sync_status: 'Synced'
                });
            } catch (err) {
                console.error("❌ Azure Sync Failed:", err.message);
                await Task.findByIdAndUpdate(newTask._id, { sync_status: 'Failed' });
            }
        }, 60000);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET USER TASKS: Fetch tasks for specific user
exports.getUserTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.params.userId }).sort({ createdAt: -1 });
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// DELETE TASK: Removes from specific platform or all
exports.deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { platform } = req.query; 

        const task = await Task.findById(id);
        if (!task) return res.status(404).json({ error: "Task not found" });

        // 1. Delete from AWS S3
        if ((platform === 'all' || platform === 'aws') && task.aws_url) {
            const key = task.aws_url.split('/').pop();
            await s3.deleteObject({ Bucket: process.env.AWS_S3_BUCKET_NAME, Key: key }).promise();
            await Task.findByIdAndUpdate(id, { $unset: { aws_url: "" } });
        }

        // 2. Delete from Azure Blob
        if ((platform === 'all' || platform === 'azure') && task.azure_url) {
            const blobName = task.azure_url.split('/').pop();
            const containerClient = blobServiceClient.getContainerClient(process.env.AZURE_CONTAINER_NAME);
            const blockBlobClient = containerClient.getBlockBlobClient(blobName);
            await blockBlobClient.deleteIfExists();
            await Task.findByIdAndUpdate(id, { $unset: { azure_url: "" } });
        }

        // 3. Delete from MongoDB (Atlas)
        if (platform === 'all') {
            await Task.findByIdAndDelete(id);
        } else {
            const updatedTask = await Task.findById(id);
            if (!updatedTask.aws_url && !updatedTask.azure_url) {
                await Task.findByIdAndDelete(id);
            } else {
                await Task.findByIdAndUpdate(id, { sync_status: `Deleted on ${platform.toUpperCase()}` });
            }
        }

        res.status(200).json({ message: `Deleted successfully from ${platform}` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to delete" });
    }
};

// GET ALL USERS: For Admin Dashboard
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ role: 'user' }).select('-password');
        const usersWithStats = await Promise.all(users.map(async (u) => {
            const count = await Task.countDocuments({ userId: u._id });
            return { _id: u._id, name: u.name, email: u.email, taskCount: count };
        }));
        res.json(usersWithStats);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ADMIN STATS: Summary for charts
exports.getAdminStats = async (req, res) => {
    try {
        const total = await Task.countDocuments();
        const synced = await Task.countDocuments({ sync_status: 'Synced' });
        const pending = await Task.countDocuments({ sync_status: 'Pending' });
        
        const chartData = [
            { name: 'Synced', value: synced },
            { name: 'Pending', value: pending }
        ];
        res.json({ total, synced, pending, chartData });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ADMIN: Delete user account and all associated objects
exports.deleteUserAccount = async (req, res) => {
    try {
        const userId = req.params.id;

        // 1. Find and remove user from User Database
        const deletedUser = await User.findByIdAndDelete(userId);

        if (!deletedUser) {
            return res.status(404).json({ message: 'Operator not found in Database.' });
        }

        // 2. Delete all instances of documents associated with this user ID
        await Task.deleteMany({ userId: userId });

        res.status(200).json({ message: 'Operator account and data deleted across instances.' });
    } catch (err) {
        res.status(500).json({ message: err.message || 'Internal Server Error' });
    }
};