const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GroupeSchema = new Schema({
  nom: { type: String, required: true },
  description: { type: String },
  date_creation: { type: Date, default: Date.now },
  createur_id: { type: Schema.Types.ObjectId, ref: 'User', required: true }
});

const Groupe = mongoose.model('Groupe', GroupeSchema);

module.exports = Groupe;