const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./user.model');
const { AbonnementStatusEnum } = require('./enums');

const CommercantSchema = new Schema({
  coins: { type: Number, default: 0 },
  status: { type: String, default: 'pending' },
  abonnement: {
    type: {
      formule_id: { type: Schema.Types.ObjectId, ref: 'FormuleAbonnement'},
      date_debut: { type: Date},
      date_fin: { type: Date},
      auto_renouvellement: { type: Boolean, default: true },
      status: { type: String, enum: Object.values(AbonnementStatusEnum), default: AbonnementStatusEnum.EN_ATTENTE},
      date_dernier_paiement: { type: Date },
      date_prochain_paiement: { type: Date }
    },
    default: null
  }
});

const Commercant = User.discriminator('Commercant', CommercantSchema);

module.exports = Commercant;