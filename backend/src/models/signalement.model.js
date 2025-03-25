const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const signalementSchema = new Schema({
    user_signale_id: {type: Schema.Types.ObjectId,ref: 'User',required: true},
    raison: {type: String,required: true},
    user_username: { type: String, required: true},
    date_signalement: {type: Date,default: Date.now},
});
    
const Signalement = mongoose.model('Signalement', signalementSchema, 'Signalement');


module.exports = Signalement;