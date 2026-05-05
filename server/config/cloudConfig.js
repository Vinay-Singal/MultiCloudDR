const AWS = require('aws-sdk');
const { BlobServiceClient } = require('@azure/storage-blob');

// AWS Configuration
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'dummy_key',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'dummy_secret',
    region: process.env.AWS_REGION || 'us-east-1'
});

// Azure Configuration with Safety Check
let blobServiceClient = null;

try {
    const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
    
    // Agar connection string valid hai tabhi initialize karo
    if (connectionString && connectionString.startsWith('DefaultEndpointsProtocol')) {
        blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
        console.log("☁️ Azure Blob Service Initialized");
    } else {
        console.warn("⚠️ Azure Connection String missing or invalid. Running in Mock Mode.");
    }
} catch (err) {
    console.error("❌ Azure Initialization Error:", err.message);
}

module.exports = { s3, blobServiceClient };