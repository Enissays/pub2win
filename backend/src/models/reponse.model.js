const mongoose = require('mongoose');

const AnswerSchema = new mongoose.Schema({
    content: { type: String,required: true,trim: true},
    questionId: {type: mongoose.Schema.Types.ObjectId,ref: 'Question',required: true},
    adminId: {type: mongoose.Schema.Types.ObjectId,ref: 'User',required: true},
  });

const Reponse = mongoose.model('Reponse', AnswerSchema);

module.exports = Reponse;