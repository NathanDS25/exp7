require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const taskRoutes = require('./routes/tasks');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/tasktracker';

// ─── Middleware ───────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serverless DB Connection Middleware
let isConnected = false;
app.use(async (req, res, next) => {
  if (process.env.VERCEL === '1' && !isConnected) {
    try {
      if (mongoose.connection.readyState !== 1) {
        await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 });
      }
      isConnected = true;
    } catch (err) {
      console.error('Serverless DB Connect Error:', err.message);
    }
  }
  next();
});

// ─── Routes ──────────────────────────────────────────────────
// Support both local development (/tasks) and Vercel routing (/_/backend/tasks)
app.use(['/tasks', '/_/backend/tasks'], taskRoutes);

// Health check
app.get(['/', '/_/backend', '/_/backend/'], (req, res) => {
  res.json({ message: '🟢 Task Tracker API is running', status: 'ok' });
});

// 404 fallback
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

// ─── Database Connection & Server Start ───────────────────────
async function startServer() {
  try {
    console.log(`⏳ Attempting to connect to MongoDB: ${MONGO_URI}`);
    await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 });
    console.log('✅ Connected to MongoDB');
  } catch (err) {
    console.warn(`⚠️ Primary MongoDB connection failed (${err.message}).`);
    console.log('🔄 Starting fallback in-memory MongoDB server...');
    
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create();
      const memUri = mongoServer.getUri();
      await mongoose.connect(memUri);
      console.log('✅ Connected to In-Memory MongoDB Fallback');
    } catch (memErr) {
      console.error('❌ Failed to start in-memory MongoDB:', memErr.message);
      process.exit(1);
    }
  }

  if (process.env.VERCEL !== '1') {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  }
}

if (process.env.VERCEL !== '1') {
  startServer();
}

module.exports = app;
