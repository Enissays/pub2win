const UserDAO = require('../repository/user.dao');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Client = require('../models/client.model');
const User = require('../models/user.model');
const Commercant = require('../models/commercant.model');

exports.register = async (req, res) => {
    try {
        const { email, pseudo, password, nom, prenom, role } = req.body;

        // Check if user already exists 
        const userExists = await UserDAO.getUserByEmail(email);
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: 'User already exists'
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        let user;

        switch (role.toLowerCase()) {
            case 'client':
                user = new Client({
                    email,
                    nom,
                    prenom,
                    username: pseudo,
                    password_hash: hashedPassword,
                    isBanned: false,
                    isTimeouted: false,
                    finBan: null,
                    role,
                    coins: 0,
                    isInfluenceur: false,
                    lien_compte_instagram: null,
                    username_instagram: null,
                    date_inscription: new Date(),
                });
                await user.save();
                break; 
            case 'commercant': // TODO: Changer sur une logique de validation plus tard
                user = new Commercant({
                    email,
                    nom,
                    prenom,
                    username: pseudo,
                    password_hash: hashedPassword,
                    isBanned: false,
                    isTimeouted: false,
                    finBan: null,
                    role,
                    coins: 0,
                    lien_compte_instagram: null,
                    username_instagram: null,
                    date_inscription: new Date(),
                });
                await user.save();
                break;
            case 'influencer':
                console.log("Influencer");
                user = new Client({
                    email,
                    nom,
                    prenom,
                    username: pseudo,
                    password_hash: hashedPassword,
                    isBanned: false,
                    isTimeouted: false,
                    finBan: null,
                    role:"CLIENT",
                    isInfluenceur: true,
                    date_inscription: new Date(),   
                });
                await user.save();
                break;
            default:
                user = new User({
                    email,
                    nom,
                    prenom,
                    username: pseudo,
                    password_hash: hashedPassword,
                    isBanned: false,
                    isTimeouted: false,
                    finBan: null,
                    role
                });
                await user.save();
                break;
        }

        console.log('User created:', user);


        // Generate JWT
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            success: true,
            token,
            user: {
                id: user._id,
                email: user.email,
                pseudo: user.pseudo,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during registration'
        });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await UserDAO.getUserByEmail(email);
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Generate JWT
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                email: user.email,
                pseudo: user.pseudo,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during login'
        });
    }
};