const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { FacturationStatusEnum } = require('./enums');

const HistoriqueFacturationSchema = new Schema({
  abonnement_id: { type: Schema.Types.ObjectId, ref: 'AbonnementCommercant', required: true },
  montant: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  reference_paiement: { type: String },
  status: { type: String, enum: Object.values(FacturationStatusEnum), default: FacturationStatusEnum.EN_ATTENTE }
});

const HistoriqueFacturation = mongoose.model('HistoriqueFacturation', HistoriqueFacturationSchema);

module.exports = HistoriqueFacturation;