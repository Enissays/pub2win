const User = require('../models/User');
const Client = require('../models/Client');

exports.updateProfile = async (req, res) => {
    try {
        const updates = req.body;
        const user = await User.findById(req.user.userId); // TODO: Get user ID from token

        Object.keys(updates).forEach(key => {
            if (user[key] !== undefined) {
                user[key] = updates[key];
            }
        });

        await user.save();
        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            user: {
                id: user._id,
                nom: user.nom,
                prenom: user.prenom,
                pseudo: user.pseudo,
                email: user.email
            }
        });
    }
    catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during profile update'
        });
    }
}

exports.deleteProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id); // TODO: Get user ID from token
        await user.remove();
        res.status(200).json({
            success: true,
            message: 'Profile deleted successfully'
        });
    }
    catch (error) {
        console.error('Profile deletion error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during profile deletion'
        });
    }
}

exports.getWallet = async (req, res) => {
    try {
        const client = await Client.findById(req.user.userId); // TODO: Get user ID from token
        res.status(200).json({
            success: true,
            wallet: client.coins
        });
    }
    catch (error) {
        console.error('Get wallet error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during wallet retrieval'
        });
    }
}

exports.withdrawFunds = async (req, res) => {
    try {
        const client = await Client.findById(req.user.userId); // TODO: Get user ID from token
        const { amount } = req.body;

        if (client.coins < amount || amount >= 10) {
            return res.status(400).json({
                success: false,
                message: 'Insufficient funds or minimum withdrawal amount is 10 coins'
            });
        }

        client.coins -= amount;
        await client.save();
        res.status(200).json({
            success: true,
            message: 'Funds withdrawn successfully'
        });
    }
    catch (error) {
        console.error('Withdrawal error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during withdrawal'
        });
    }
}