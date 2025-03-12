const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { ConversionStatusEnum } = require('./enums');

const ConversionCoinsSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  montant_coins: { type: Number, required: true },
  montant_euros: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  status: { type: String, enum: Object.values(ConversionStatusEnum), default: ConversionStatusEnum.EN_ATTENTE }
});

const ConversionCoins = mongoose.model('ConversionCoins', ConversionCoinsSchema);

module.exports = ConversionCoins;