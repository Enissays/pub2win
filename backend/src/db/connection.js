const mongoose = require('mongoose');
require("dotenv").config(); 
const MONGODB_URI = process.env.MONGODB_URI;

const dbConnection = () => {
  return mongoose.connect(MONGODB_URI)
    .then(() => {
      console.log("MongoDB connected successfully");
    })
    .catch((error) => {
      console.error("Error connecting to MongoDB:", error);
    });
};

module.exports = dbConnection;