const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommissionSchema = new Schema({
  transaction_id: { type: Schema.Types.ObjectId, ref: 'Transaction', required: true },
  pourcentage: { type: Number, required: true },
  montant: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});

const Commission = mongoose.model('Commission', CommissionSchema);

module.exports = Commission;