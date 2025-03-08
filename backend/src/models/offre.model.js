const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OffreSchema = new Schema({
  commercant_id: { type: Schema.Types.ObjectId, ref: 'Commercant', required: true },
  titre: { type: String, required: true },
  description: { type: String, required: true },
  montant_coins: { type: Number, required: true },
  date_debut: { type: Date, required: true },
  date_fin: { type: Date, required: true },
  is_active: { type: Boolean, default: true }
});

const Offre = mongoose.model('Offre', OffreSchema);

module.exports = Offre;