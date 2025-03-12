const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const dotenv = require('dotenv');
const CommercantRoute = require('.//routes/vendor.route');
const offreRoutes = require('.//routes/offre.route');
const userRoutes = require('.//routes/user.route');
const conversionCoinsRoutes = require('.//routes/conversionCoins.route');
const AideRoutes = require('.//routes/aide.route');
const QueRoutes = require('.//routes/question.route');
const ResRoutes= require('.//routes/reponse.route');
// Load environment variables
dotenv.config();
// Initialize Express app
const app = express();
const server = http.createServer(app);

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
app.use('/gainApp', conversionCoinsRoutes);
app.use('/aide', AideRoutes);
app.use('/question', QueRoutes);
app.use('/reponse', ResRoutes);

// Basic route
app.get('/', (req, res) => {
  res.send('Welcome to Pub2Win API');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { app};