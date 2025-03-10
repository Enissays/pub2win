const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EndroitSchema = new Schema({
  commercant_id: { type: Schema.Types.ObjectId, ref: 'Commercant', required: true },
  nom: { type: String, required: true },
  adresse: { type: String, required: true },
  coordonnees_gps: { type: String },
  description: { type: String },
  conditions: [{ minConsommation: {type: Number},  date_utilisation: { type: Date } }]
});

const Endroit = mongoose.model('Endroit', EndroitSchema);

module.exports = Endroit;