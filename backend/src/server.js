const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIO = require('socket.io');
const dotenv = require('dotenv');
const testRoutes = require('./routes/route');
const { authenticateToken } = require('./middlewares/auth');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Socket.IO setup for real-time messaging
io.on('connection', (socket) => {
  console.log('New client connected');
  
  socket.on('join_room', (roomId) => {
    socket.join(roomId);
    console.log(`User joined room: ${roomId}`);
  });
  
  socket.on('send_message', (data) => {
    io.to(data.roomId).emit('receive_message', data);
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Routes
//app.use('/auth', authRoutes);
//app.use('/vendor', authenticateToken, vendorRoutes);
//app.use('/user', authenticateToken, userRoutes);
//app.use('/influencer', authenticateToken, influencerRoutes);
//app.use('/offer', offerRoutes); // Some offer routes may need authentication
//app.use('/admin', authenticateToken, adminRoutes);
app.use('/', testRoutes);



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

module.exports = { app, io };