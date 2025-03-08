const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { AbonnementStatusEnum } = require('./enums');

const AbonnementCommercantSchema = new Schema({
  commercant_id: { type: Schema.Types.ObjectId, ref: 'Commercant', required: true },
  formule_id: { type: Schema.Types.ObjectId, ref: 'FormuleAbonnement', required: true },
  date_debut: { type: Date, required: true },
  date_fin: { type: Date, required: true },
  auto_renouvellement: { type: Boolean, default: true },
  status: { type: String, enum: Object.values(AbonnementStatusEnum), default: AbonnementStatusEnum.ACTIF },
  date_dernier_paiement: { type: Date },
  date_prochain_paiement: { type: Date }
});

const AbonnementCommercant = mongoose.model('AbonnementCommercant', AbonnementCommercantSchema);

module.exports = AbonnementCommercant;