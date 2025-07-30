import express from 'express';
import cors from 'cors';

import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import formRoutes from './routes/formRoutes.js';  // ✅ New import
import aiRoutes from './routes/aiRoutes.js';      // ✅ AI routes

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploaded files statically
app.use('/uploads', express.static('uploads'));

// Database connection
connectDB();

// Routes
app.use('/api', authRoutes);         // For /api/register and /api/login
app.use('/api/forms', formRoutes);   // ✅ For /api/forms/startup-form and investor-form
app.use('/api/ai', aiRoutes);        // ✅ For /api/ai/analyze and /api/ai/chat

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
