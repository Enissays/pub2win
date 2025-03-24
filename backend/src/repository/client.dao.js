const Client= require('../models/client.model');
const ClientDAO = {

    async createClient(clientData) {
        if (!clientData || typeof clientData !== 'object') {
        return null;
        }
        
        const newClient = new Client(clientData);
        return await newClient.save().catch(() => null);
    },
    
    async getClientById(clientId) {
        if (!clientId) {
        return null;
        }
        
        return await Client.findById(clientId).catch(() => null);
    },
    
    async getClientByEmail(email) {
        if (!email) {
        return null;
        }
        
        return await Client.findOne({ email }).catch(() => null);
    },
    
    async getClientByUsername(username) {
        if (!username) {
        return null;
        }
        
        return await Client.findOne({ username }).catch(() => null);
    },
    
    async updateClient(clientId, updateData) {
        if (!clientId || !updateData || typeof updateData !== 'object') {
        return null;
        }
        
        return await Client.findByIdAndUpdate(clientId, updateData, { new: true }).catch(() => null);
    },
    
    async deleteClient(clientId) {
        if (!clientId) {
        return null;
        }
        
        return await Client.findByIdAndDelete(clientId).catch(() => null);
    },
    
    async getAllClients() {
        return await Client.find().catch(() => []);
    },

    async getClientByInstagramUsername(username) {
        if (!username) {
        return null;
        }
        
        return await Client.findOne({ username_instagram: username }).catch(() => null);
    },

    
    };

module.exports = ClientDAO;