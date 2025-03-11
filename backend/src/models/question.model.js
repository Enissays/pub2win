const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { QuestionStatusEnum } = require('./enums');

const QuestionSchema = new Schema({
    user_id: {type: String,required: true},
    contenu: {type: String,required: true},
    date_creation: {type: Date,default: Date.now},
    statut: {type: String, enum: Object.values(QuestionStatusEnum), default: QuestionStatusEnum.EN_ATTENTE }
});

const Question = mongoose.model('Question', QuestionSchema);

module.exports = Question;