
const Vendor = require('../models/Vendor');
const User = require('../models/User');
const Offer = require('../models/Offer');
const Subscription = require('../models/Subscription');
const Influencer = require('../models/Influencer');
const Application = require('../models/Application');
const Transaction = require('../models/Transaction');

exports.subscribe = async (req, res) => { 
    try {
        const vendor = await Vendor.findById(req.user.userId); // TODO: Get user ID from token
        const subscription = new Subscription({
            vendor: vendor._id,
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
        const vendor = await Vendor.findById(req.user.userId); // TODO: Get user ID from token
        const offer = new Offer({
            vendor: vendor._id,
            title: req.body.title,
            description: req.body.description,
            category: req.body.category,
            price: req.body.price
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
        const vendor = await Vendor.findById(req.user.userId); // TODO: Get user ID from token
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
        const vendor = await Vendor.findById(req.params.id);
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

exports.delete = async (req, res) => {
    try {
        const vendor = await Vendor.findById(req.params.id);
        await vendor.remove();
        res.status(200).json({
            success: true,
            message: 'Vendor deleted successfully'
        });
    }
    catch (error) {
        console.error('Deletion error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during deletion'
        });
    }
}