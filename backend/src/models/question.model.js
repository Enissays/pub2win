const mongoose = require('mongoose');


const QuestionSchema = new mongoose.Schema({
  content: {type: String,trim: true},
  userId: {type: mongoose.Schema.Types.ObjectId,ref: 'User'},
});

const Question = mongoose.model('Question', QuestionSchema);

module.exports = Question;