const mongoose = require('mongoose');
const { SignalementEnum } = require('./enums');


const notificationSignalementSchema = new mongoose.Schema({
  content: {type: String,trim: true},
  userId: {type: mongoose.Schema.Types.ObjectId,ref: 'User'},
  type:{type: String, enum: Object.values(SignalementEnum)}
},
{
    timestamps: true // Ajoute createdAt et updatedAt
  
});

const notificationSignalement = mongoose.model('notificationSignalement', notificationSignalementSchema);

module.exports = notificationSignalement;