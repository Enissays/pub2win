const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const dotenv = require('dotenv');
const { Clerk } = require('@clerk/clerk-sdk-node');
const routes = require('./routes/route');


// Check if key is loaded
console.log('Clerk Secret Key available:', !!process.env.CLERK_SECRET_KEY);

// Initialize Clerk
const clerk = Clerk({ secretKey: process.env.CLERK_SECRET_KEY });

const CommercantRoute = require('.//routes/vendor.route');
const offreRoutes = require('.//routes/offre.route');
const userRoutes = require('.//routes/user.route');
const AideRoutes = require('.//routes/aide.route');
const QueRoutes = require('.//routes/question.route');
const ResRoutes = require('.//routes/reponse.route');
const TransactionRoute = require('.//routes/transaction.route');
const SignalementRoute = require('.//routes/signalement.route');
const utilis=require('./utilis');
const testRoutes = require('./routes/route');
const { authenticateToken } = require('./middlewares/auth');
const socketIO = require('socket.io');

// At the top of your server.js file
require('dotenv').config();

// Check if JWT_SECRET is loaded
if (!process.env.JWT_SECRET) {
  console.warn('WARNING: JWT_SECRET is not set in environment variables. Using fallback secret.');
}

// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));



// Routes
app.use('/abCo', CommercantRoute);
app.use('/Offre', offreRoutes);
app.use('/user', userRoutes);
app.use('/aide', AideRoutes);
app.use('/question', QueRoutes);
app.use('/reponse', ResRoutes);
app.use('/transaction', TransactionRoute);
app.use('/signalement', SignalementRoute);
app.use('/', testRoutes);

// Basic route
app.get('/', (req, res) => {
  utilis.addClientToOffre();  
  res.send('Welcome to Pub2Win API');
});
// Add your routes
app.use('/', routes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Export server object to use in index.js
module.exports = { app, io, server };
