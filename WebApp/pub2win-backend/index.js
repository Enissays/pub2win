// index.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import signupRouter from './routes/signup.js';
import loginRouter from './routes/login.js'; // New import

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/signup', signupRouter);
app.use('/api/login', loginRouter); // Add login route

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});