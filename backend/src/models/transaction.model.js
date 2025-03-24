const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { TransactionStatusEnum } = require('./enums');

const TransactionSchema = new Schema({
  client_id: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
  commercant_id: { type: Schema.Types.ObjectId, ref: 'Commercant', required: true },
  montant: { type: Number, required: true },
  commission_app: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  status: { type: String, enum: Object.values(TransactionStatusEnum), default: TransactionStatusEnum.EN_ATTENTE },
  description: { type: String }
});
const Transaction = mongoose.model('Transaction', TransactionSchema, 'Transaction');


module.exports = Transaction;