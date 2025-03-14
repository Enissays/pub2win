const ConversionCoins = require('../models/conversionCoins.model');
const ConversionCoinsDAO = {
    async createConversionCoins(conversionCoinsData) {
        if (!conversionCoinsData || typeof conversionCoinsData !== 'object') {
            return null;
        }
        
        const newConversionCoins = new ConversionCoins(conversionCoinsData);
        return await newConversionCoins.save().catch(() => null);
    },
    
    async getConversionCoinsById(conversionCoinsId) {
        if (!conversionCoinsId) {
            return null;
        }
        
        return await ConversionCoins.findById(conversionCoinsId).catch(() => null);
    },
    
    async getConversionCoinsByClientOffreId(clientOffreId) {
        if (!clientOffreId) {
            return null;
        }
        
        return await ConversionCoins.findOne({ clientOffreId }).catch(() => null);
    },
    
    async updateConversionCoins(conversionCoinsId, updateData) {
        if (!conversionCoinsId || !updateData || typeof updateData !== 'object') {
            return null;
        }
        
        return await ConversionCoins.findByIdAndUpdate(conversionCoinsId, updateData, { new: true }).catch(() => null);
    },
    
    async deleteConversionCoins(conversionCoinsId) {
        if (!conversionCoinsId) {
            return null;
        }
        
        return await ConversionCoins.findByIdAndDelete(conversionCoinsId).catch(() => null);
    },
  
    async getAllConversionCoins() {
        return await ConversionCoins.find().catch(() => []);
    }
    };
module.exports = ConversionCoinsDAO;
