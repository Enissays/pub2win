import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import sanitize from 'mongo-sanitize';
import validator from 'validator';
import User from '../models/user.model.js';
import Commercant from '../models/commercant.model.js';
import Client from '../models/client.model.js';

const router = express.Router();

// 🛡 Apply Rate Limiting (Prevent Mass Signups)
const signupLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit to 10 signups per window
  message: 'Too many sign-up attempts. Try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/', signupLimiter, async (req, res) => {
  try {
    const { 
      firstName, 
      lastName, 
      email, 
      password, 
      role,
      isInfluenceur = false,
      lien_compte_instagram,
      username_instagram,
      businessName
    } = req.body;

    // 🔍 Input Validation
    if (!firstName || !lastName || !email || !password || !role) {
      return res.status(400).json({ message: 'All required fields must be provided.' });
    }

    // ✋ Prevent XSS and NoSQL Injection
    const normalizedEmail = sanitize(email.trim().toLowerCase());

    // 📧 Validate Email Format
    if (!validator.isEmail(normalizedEmail)) {
      return res.status(400).json({ message: 'Invalid email format.' });
    }

    // 🔑 Enforce Strong Password Policy
    if (!validator.isStrongPassword(password, { minLength: 8, minNumbers: 1, minUppercase: 1 })) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long and include a number and an uppercase letter.' });
    }

    // 🚫 Prevent Duplicate Users
    const existingUser = await User.findOne({ email: normalizedEmail }).lean();
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists.' });
    }

    // 🔒 Hash Password Securely
    const hashedPassword = bcrypt.hashSync(password, 12); // 12 rounds for security

    // 🆕 Create User
    const newUser = new User({
      firstName: sanitize(firstName),
      lastName: sanitize(lastName),
      email: normalizedEmail,
      password: hashedPassword,
      role
    });

    await newUser.save();

    // 🏢 Create Role-Specific Data
    let roleDoc;
    if (role === 'commercant') {
      roleDoc = new Commercant({ 
        user: newUser._id,
        businessName: sanitize(businessName)
      });
    } else if (role === 'client') {
      roleDoc = new Client({ 
        user: newUser._id,
        coins: 0, // 👀 Prevent manual coins setting by non-admins
        isInfluenceur,
        lien_compte_instagram: sanitize(lien_compte_instagram),
        username_instagram: sanitize(username_instagram)
      });
    }
    
    if (roleDoc) {
      await roleDoc.save();
    }

    // 🔑 Create Secure JWT Token
    const token = jwt.sign(
      { userId: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h', algorithm: 'HS512' } // Use HS512 for stronger security
    );

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: newUser._id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        role: newUser.role,
        token
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
