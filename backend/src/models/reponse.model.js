const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReponseSchema = new Schema({
    
});

const Reponse = mongoose.model('Reponse', ReponseSchema);

module.exports = Reponse;