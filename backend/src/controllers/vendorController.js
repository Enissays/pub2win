
const User = require('../models/user.model');
const Client = require('../models/client.model');
const Offer = require('../models/offre.model');

/*

const OffreSchema = new Schema({
  commercant_id: { type: Schema.Types.ObjectId, ref: 'Commercant', required: true },
  titre: { type: String, required: true },
  description: { type: String, required: true },
  montant_coins: { type: Number, required: true },
  date_debut: { type: Date, required: true },
  date_fin: { type: Date, required: true },
  is_active: { type: Boolean, default: true },
  clients: [{ type: Schema.Types.ObjectId, ref: 'Client', is_completed: { type: Boolean, default: false }, date_utilisation: { type: Date } }]
});
*/

exports.subscribe = async (req, res) => { 
    try {
        const user = await User.findById(req.user.userId); // TODO: Get user ID from token
        const subscription = new Subscription({
            user: user._id,
            status: 'active'
        });
        await subscription.save();
        res.status(200).json({
            success: true,
            message: 'Subscription successful'
        });
    }
    catch (error) {
        console.error('Subscription error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during subscription'
        });
    }
}

exports.announce = async (req, res) => {
    try {
        const vendor = await User.findById(req.user.userId); // TODO: Get user ID from token
        const offer = new Offer(
            {
                commercant_id: vendor._id,
                titre: req.body.titre,
                description: req.body.description,
                montant_coins: req.body.montant_coins,
                date_debut: req.body.date_debut,
                date_fin: req.body.date_fin,
                is_active: true,
                clients: req.body.clients.map(client => {
                    return {
                        client: client,
                        is_completed: false
                    }
                })
            });
        await offer.save();



        res.status(200).json({
            success: true,
            message: 'Offer announced successfully'
        });
    }
    catch (error) {
        console.error('Announcement error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during announcement'
        });
    }
}

exports.setupBanking = async (req, res) => {
    try {
        const vendor = await User.findById(req.user.userId); // TODO: Get user ID from token
        vendor.iban = req.body.iban;
        await vendor.save();
        res.status(200).json({
            success: true,
            message: 'Banking setup successful'
        });
    }
    catch (error) {
        console.error('Banking setup error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during banking setup'
        });
    }
}

exports.validate = async (req, res) => {
    try {
        const vendor = await User.findById(req.params.id);
        vendor.status = 'validated';
        await vendor.save();
        res.status(200).json({
            success: true,
            message: 'Vendor validated successfully'
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
