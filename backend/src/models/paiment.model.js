const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { PaiementTypeEnum, PaiementStatusEnum } = require('./enums');

const PaiementSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  montant: { type: Number, required: true },
  type: { type: String, enum: Object.values(PaiementTypeEnum), required: true },
  status: { type: String, enum: Object.values(PaiementStatusEnum), default: PaiementStatusEnum.EN_ATTENTE },
  date: { type: Date, default: Date.now },
  reference_externe: { type: String }
});

const Paiement = mongoose.model('Paiement', PaiementSchema);

module.exports = Paiement;