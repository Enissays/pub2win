const Rating = require('../models/rating.model');
const RatingDAO = {
    async createRating(ratingData) {
        if (!ratingData || typeof ratingData !== 'object') {
            return null;
        }
        
        const newRating = new Rating(ratingData);
        return await newRating.save().catch(() => null);
    },
    
    async getRatingById(ratingId) {
        if (!ratingId) {
            return null;
        }
        
        return await Rating.findById(ratingId).catch(() => null);
    },

    async getRatingByClientId(clientId) {
        if (!clientId) {
            return null;
        }
        
        return await Rating.findOne({ clientId }).catch(() => null);
    }
};
module.exports = RatingDAO;