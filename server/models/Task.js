const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    title: { type: String, required: true },
    description: { type: String },
    
    // Cloud Storage Details
    aws_url: { type: String },           // Primary (AWS)
    azure_url: { type: String },         // Backup (Azure)
    
    // Replication Tracking
    sync_status: { 
        type: String, 
        enum: ['Pending', 'Synced', 'Failed'], 
        default: 'Pending' 
    },
    replication_delay: { type: Number, default: 0 }, // Seconds mein record karenge
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Task', taskSchema);