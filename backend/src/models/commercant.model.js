const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./user.model');
const { AbonnementStatusEnum } = require('./enums');

const CommercantSchema = new Schema({
  coins: { type: Number, default: 0 },
  status: { type: String, default: 'pending' },
  abonnement : {
    formule_id: { type: Schema.Types.ObjectId, ref: 'FormuleAbonnement', required: true },
    date_debut: { type: Date, required: true },
    date_fin: { type: Date, required: true },
    auto_renouvellement: { type: Boolean, default: true },
    status: { type: String, enum: Object.values(AbonnementStatusEnum), default: AbonnementStatusEnum.ACTIF},
    date_dernier_paiement: { type: Date },
    date_prochain_paiement: { type: Date }
  }
});

const Commercant = User.discriminator('Commercant', CommercantSchema);

module.exports = Commercant;