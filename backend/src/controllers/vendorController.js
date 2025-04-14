const UserDAO = require('../repository/user.dao');
const EndroitDAO = require('../repository/endroit.dao');
const OfferDAO = require('../repository/offre.dao');

exports.getEndroits = async (req, res) => {
    try {
        const endroits = await EndroitDAO.getAllEndroits();
        if (!endroits) {
            return res.status(404).json({
                success: false,
                message: 'No endroits found for this vendor'
            });
        }
        res.status(200).json({
            success: true,
            endroits
        });
    } catch (error) {
        console.error('Get endroits error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during endroits retrieval'
        });
    }
}

exports.setConditions = async (req, res) => {
    try {
        const vendor = await UserDAO.getUserById(req.query.userId); // TODO: Get user ID from token
        const endroit = await EndroitDAO.getEndroitById(req.params.id_endroit);

        if (endroit.commercant_id.toString() !== vendor._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized'
            });
        }

        endroit.conditions = req.body.conditions;

        await endroit.save();
        res.status(200).json({
            success: true,
            message: 'Conditions set successfully'
        });
    }
    catch (error) {
        console.error('Conditions error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during conditions setup'
        });
    }
}

exports.getEndroit = async (req, res) => {
    try {
        const endroit = await EndroitDAO.getEndroitById(req.params.id_endroit);
        res.status(200).json({
            success: true,
            endroit
        });
    }
    catch (error) {
        console.error('Endroit error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during endroit retrieval'
        });
    }
}

exports.deleteEndroit = async (req, res) => {
    try {
        const endroit = await EndroitDAO.getEndroitById(req.params.id_endroit);
        if (!endroit) {
            return res.status(404).json({
                success: false,
                message: 'Endroit not found'
            });
        }
        await endroit.remove();
        res.status(200).json({
            success: true,
            message: 'Endroit deleted successfully'
        });
    } catch (error) {
        console.error('Delete endroit error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during endroit deletion'
        });
    }
}

exports.updateEndroit = async (req, res) => {
    try {
        const endroit = await EndroitDAO.getEndroitById(req.params.id);
        if (!endroit) {
            return res.status(404).json({
                success: false,
                message: 'Endroit not found'
            });
        }
        if (endroit.commercant_id.toString() !== req.user.userId) {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized'
            });
        }
        Object.assign(endroit, req.body);
        await endroit.save();
        res.status(200).json({
            success: true,
            message: 'Endroit updated successfully'
        });
    } catch (error) {
        console.error('Update endroit error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during endroit update'
        });
    }
}

exports.createEndroit = async (req, res) => {
    try {
        const vendor = await UserDAO.getUserById(req.query.userId); // TODO: Get user ID from token
        if (vendor.status !== 'validated') {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized, not validated yet, actual status: ' + vendor.status
            });
        }
        const endroit = await EndroitDAO.createEndroit(
        {
            ...req.body,
            commercant_id: req.query.userId
        });
        if (!endroit) {
            return res.status(400).json({
                success: false,
                message: 'Endroit creation failed'
            });
        }
        res.status(201).json({
            success: true,
            message: 'Endroit created successfully',
            endroit
        });
    } catch (error) {
        console.error('Create endroit error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during endroit creation'
        });
    }
}


exports.subscribe = async (req, res) => { 
    try {
        const user = await UserDAO.getUserById(req.user.userId); // TODO: Get user ID from token
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
        const vendor = await UserDAO.getUserById(req.query.userId); // TODO: Get user ID from token
        const offer = await OfferDAO.createOffre(
            {
                ...req.body,
                commercant_id: vendor._id,
                is_active: true, 
                clients: req.body.clients.map(client => {
                    return {
                        client: client,
                        is_completed: false
                    }
                })
            });

            if (!offer) {
                return res.status(400).json({
                    success: false,
                    message: 'Offer announcement failed'
                });
            }




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
        const vendor = await UserDAO.getUserById(req.user.userId); // TODO: Get user ID from token
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
        const vendor = await UserDAO.getUserById(req.params.id);
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
