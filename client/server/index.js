import express from 'express';
import cors from 'cors';

import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import formRoutes from './routes/formRoutes.js';  // ✅ New import

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
connectDB();

// Routes
app.use('/api', authRoutes);         // For /api/register and /api/login
app.use('/api/forms', formRoutes);   // ✅ For /api/forms/startup-form and investor-form

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
