const Transaction = require('../models/transaction.model');
const TransactionDAO = {
    async createTransaction(transactionData) {
        if (!transactionData || typeof transactionData !== 'object') {
            return null;
        }
        
        const newTransaction = new Transaction(transactionData);
        return await newTransaction.save().catch(() => null);
    },
    
    async getTransactionById(transactionId) {
        if (!transactionId) {
            return null;
        }
        
        return await Transaction.findById(transactionId).catch(() => null);
    },

    async getTransactionByClientId(clientId) {
        if (!clientId) {
            return null;
        }
        
        return await Transaction.findOne({ clientId }).catch(() => null);
    }
};
module.exports = TransactionDAO;