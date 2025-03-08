const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FormuleAbonnementSchema = new Schema({
  nom: { type: String, required: true },
  description: { type: String },
  prix_mensuel: { type: Number, required: true },
  prix_annuel: { type: Number, required: true },
  nb_offres_max: { type: Number, required: true },
  nb_endroits_max: { type: Number, required: true },
  commission_reduite: { type: Number, required: true },
  analytics_avancees: { type: Boolean, default: false },
  support_prioritaire: { type: Boolean, default: false },
  visibilite_premium: { type: Boolean, default: false }
});

const FormuleAbonnement = mongoose.model('FormuleAbonnement', FormuleAbonnementSchema);

module.exports = FormuleAbonnement;