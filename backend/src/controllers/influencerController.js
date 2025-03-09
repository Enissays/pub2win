const User = require('../models/user.model');
const Client = require('../models/client.model');
const Rating = require('../models/rating.model');

/*

const RatingSchema = new Schema({
  auteur_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  user_rated_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  commentaire: { type: String },
  rate: { type: Number, required: true, min: 0, max: 5 },
  date: { type: Date, default: Date.now }
});

router.get('/influencer/:id', authenticateToken, influencerController.getProfile);
router.post('/influencer/rate/:id', authenticateToken, influencerController.rateInfluencer);
router.post('/influencer/comment/:id', authenticateToken, influencerController.commentInfluencer);
router.post('/influencer/accept/:id', authenticateToken, isInfluencer, influencerController.acceptOffer);
router.post('/influencer/:id/validate', authenticateToken, isAdmin, influencerController.validate);
router.delete('/influencer/:id/delete', authenticateToken, isAdmin, influencerController.delete);
*/

exports.getProfile = async (req, res) => {
    try {
        const influencer = await Client.findOne({ userId: req.params.id });
        if (!influencer) {
            return res.status(404).json({
                success: false,
                message: 'Influencer not found'
            });
        }

        res.status(200).json({
            success: true,
            influencer: {
                id: influencer._id,
                username: influencer.username,
                email: influencer.email,
                nom: influencer.nom,
                prenom: influencer.prenom,
                role: influencer.role,
                coins: influencer.coins,
                lien_compte_instagram: influencer.lien_compte_instagram,
                username_instagram: influencer.username_instagram
            }
        });

    }
    catch (error) {
        console.error('Get influencer error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during influencer retrieval'
        });
    }
}


exports.rateInfluencer = async (req, res) => {
    try {
        const client = await Client.findById(req.user.userId); // TODO: Get user ID from token
        const influencer = await Client.findById(req.params.id);
        const { rate, commentaire } = req.body;

        if (rate < 0 || rate > 5) {
            return res.status(400).json({
                success: false,
                message: 'Invalid rating value'
            });
        }

        const rating = new Rating({
            auteur_id: client._id,
            user_rated_id: influencer._id,
            rate,
            commentaire
        });

        await rating.save();
        res.status(200).json({
            success: true,
            message: 'Influencer rated successfully'
        });
    }
    catch (error) {
        console.error('Rating error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during rating'
        });
    }
}

exports.commentInfluencer = async (req, res) => {
    try {
        const client = await Client.findById(req.user.userId); // TODO: Get user ID from token
        const influencer = await Client.findById(req.params.id);
        const { commentaire } = req.body;

        const rating = new Rating({
            auteur_id: client._id,
            user_rated_id: influencer._id,
            commentaire
        });

        await rating.save();
        res.status(200).json({
            success: true,
            message: 'Comment added successfully'
        });
    }
    catch (error) {
        console.error('Comment error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during comment'
        });
    }
}

exports.acceptOffer = async (req, res) => {
    try {
        const influencer = await Client.findById(req.user.userId); // TODO: Get user ID from token
        const offer = await Offer.findById(req.params.id);

        if (offer.status !== 'pending') {
            return res.status(400).json({
                success: false,
                message: 'Offer is not pending'
            });
        }

        offer.status = 'accepted';
        await offer.save();
        res.status(200).json({
            success: true,
            message: 'Offer accepted successfully'
        });
    }
    catch (error) {
        console.error('Accept offer error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during offer acceptance'
        });
    }
}

exports.validate = async (req, res) => {
    try {
        const influencer = await Client.findById(req.params.id);
        influencer.role = 'influencer';
        await influencer.save();
        res.status(200).json({
            success: true,
            message: 'Influencer validated successfully'
        });
    }
    catch (error) {
        console.error('Validation error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during validation'
        });
    }
}

exports.delete = async (req, res) => {
    try {
        const influencer = await Client.findById(req.params.id);
        await influencer.remove();
        res.status(200).json({
            success: true,
            message: 'Influencer deleted successfully'
        });
    }

    catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during deletion'
        });
    }

}

