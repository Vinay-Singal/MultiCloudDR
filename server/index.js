const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api', require('./routes/api'));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected (Atlas)"))
    .catch(err => console.log("❌ DB Connection Error:", err));

// Basic Route for Testing
app.get('/', (req, res) => {
    res.send("Multi-Cloud Replication API is Running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));