const { s3, blobServiceClient } = require('../config/cloudConfig');
const Task = require('../models/Task');

exports.createTask = async (req, res) => {
    try {
        const { title, description, userId } = req.body;
        const file = req.file;

        if (!file) return res.status(400).json({ error: "File upload is required" });

        // 1. Upload to AWS (Try-Catch taaki agar real key na ho toh crash na ho)
        let awsUrl = `https://s3.amazonaws.com/mock-bucket/${Date.now()}-${file.originalname}`;
        try {
            if (process.env.AWS_ACCESS_KEY_ID !== 'your_aws_key') {
                const awsParams = {
                    Bucket: process.env.AWS_S3_BUCKET_NAME,
                    Key: `${Date.now()}-${file.originalname}`,
                    Body: file.buffer,
                    ContentType: file.mimetype
                };
                const awsData = await s3.upload(awsParams).promise();
                awsUrl = awsData.Location;
            }
        } catch (e) {
            console.log("Mocking AWS Upload...");
        }

        const newTask = await Task.create({
            userId,
            title,
            description,
            aws_url: awsUrl,
            sync_status: 'Pending'
        });

        res.status(201).json({ message: "Uploaded to Primary. Azure sync started...", task: newTask });

        // 2. The 1-Minute Replication Logic
        setTimeout(async () => {
            try {
                let azureUrl = `https://azurestorage.blob.core.windows.net/mock-container/${Date.now()}-${file.originalname}`;

                // Agar Azure client active hai toh real upload karo
                if (blobServiceClient) {
                    const containerClient = blobServiceClient.getContainerClient(process.env.AZURE_CONTAINER_NAME);
                    const blockBlobClient = containerClient.getBlockBlobClient(`${Date.now()}-${file.originalname}`);
                    await blockBlobClient.upload(file.buffer, file.buffer.length);
                    azureUrl = blockBlobClient.url;
                }

                await Task.findByIdAndUpdate(newTask._id, {
                    azure_url: azureUrl,
                    sync_status: 'Synced',
                    replication_delay: 60
                });
                console.log(`✅ Replication Complete: ${title}`);
            } catch (err) {
                console.error("❌ Sync Failed:", err.message);
                await Task.findByIdAndUpdate(newTask._id, { sync_status: 'Failed' });
            }
        }, 60000);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
// exports.deleteTask = async (req, res) => {
//     try {
//         await Task.findByIdAndDelete(req.params.id);
//         res.json({ message: "Deleted successfully" });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// };
// ************more detailed delete logic with cloud cleanup************    
exports.deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { platform } = req.query; // 'all', 'aws', 'azure', or 'atlas'

        const task = await Task.findById(id);
        if (!task) return res.status(404).json({ error: "Task not found" });

        // 1. Delete from AWS S3
        if (platform === 'all' || platform === 'aws') {
            const key = task.aws_url.split('/').pop();
            await s3.deleteObject({
                Bucket: process.env.AWS_S3_BUCKET_NAME,
                Key: key
            }).promise();
        }

        // 2. Delete from Azure Blob
        if (platform === 'all' || platform === 'azure') {
            if (blobServiceClient && task.azure_url) {
                const containerClient = blobServiceClient.getContainerClient(process.env.AZURE_CONTAINER_NAME);
                const blobName = task.azure_url.split('/').pop();
                const blockBlobClient = containerClient.getBlockBlobClient(blobName);
                await blockBlobClient.delete();
            }
        }

        // 3. Delete from MongoDB (Atlas)
        if (platform === 'all' || platform === 'atlas') {
            await Task.findByIdAndDelete(id);
        }

        res.status(200).json({ message: `Deleted successfully from ${platform}` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to delete from one or more platforms" });
    }
};
// Dashboard fetch logic
exports.getUserTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.params.userId }).sort({ createdAt: -1 });
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Admin Stats logic
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

// Isse taskController.js ke end mein add karo
exports.getAllUsers = async (req, res) => {
    try {
        const User = require('../models/User'); // Import inside to avoid circular deps
        const users = await User.find({ role: 'user' }).select('-password');
        
        // Har user ke liye uske tasks count karo (Advanced Aggregation)
        const userWithStats = await Promise.all(users.map(async (u) => {
            const taskCount = await Task.countDocuments({ userId: u._id });
            const awsCount = await Task.countDocuments({ userId: u._id, aws_url: { $exists: true } });
            return { ...u._doc, taskCount, awsCount };
        }));

        res.json(userWithStats);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Add this at the very bottom of taskController.js
exports.getAllUsers = async (req, res) => {
    try {
        // We require it here to avoid potential circular dependency issues
        const User = require('../models/User'); 
        const Task = require('../models/Task');

        // Find all users who are NOT admins
        const users = await User.find({ role: 'user' }).select('-password');
        
        // Map through users to attach their specific task counts
        const usersWithTaskCount = await Promise.all(users.map(async (u) => {
            const count = await Task.countDocuments({ userId: u._id });
            return {
                _id: u._id,
                name: u.name,
                email: u.email,
                taskCount: count
            };
        }));

        res.status(200).json(usersWithTaskCount);
    } catch (err) {
        console.error("Error fetching users:", err);
        res.status(500).json({ error: "Could not fetch user registry" });
    }
};