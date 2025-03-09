const Commission = require('../models/commission.model');
const CommissionDAO = {
    async createCommission(commissionData) {
        if (!commissionData || typeof commissionData !== 'object') {
            return null;
        }
        
        const newCommission = new Commission(commissionData);
        return await newCommission.save().catch(() => null);
    },
    
    async getCommissionById(commissionId) {
        if (!commissionId) {
            return null;
        }
        
        return await Commission.findById(commissionId).catch(() => null);
    },
    
    async getCommissionByClientOffreId(clientOffreId) {
        if (!clientOffreId) {
            return null;
        }
        
        return await Commission.findOne({ clientOffreId }).catch(() => null);
    },
    
    async updateCommission(commissionId, updateData) {
        if (!commissionId || !updateData || typeof updateData !== 'object') {
            return null;
        }
        
        return await Commission.findByIdAndUpdate(commissionId, updateData, { new: true }).catch(() => null);
    },
    
    async deleteCommission(commissionId) {
        if (!commissionId) {
            return null;
        }
        
        return await Commission.findByIdAndDelete(commissionId).catch(() => null);
    },
    
    async getAllCommissions() {
        return await Commission.find().catch(() => []);
    }
    };
module.exports = CommissionDAO;