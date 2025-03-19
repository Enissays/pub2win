const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { QuestionStatusEnum } = require('./enums');

const QuestionSchema = new Schema({
    user_id: {type: String},
    content: {type: String},
    date_creation: {type: Date, default: Date.now},
    reponse: {
        type: {
            content: {type: String},
            date_creation: {type: Date},
        },
        default: null
    }
});

const Question = mongoose.model('Question', QuestionSchema);

module.exports = Question;