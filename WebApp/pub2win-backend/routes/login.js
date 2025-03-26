import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import sanitize from 'mongo-sanitize';
import User from '../models/user.model.js';
import Commercant from '../models/commercant.model.js';
import Client from '../models/client.model.js';

const router = express.Router();

// Apply security middleware
router.use(helmet());

// Rate limiter to prevent brute-force attacks
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit to 5 login attempts per window
  message: 'Too many login attempts. Try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/', loginLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Sanitize and normalize email
    const normalizedEmail = sanitize(email.trim().toLowerCase());

    // Find user by sanitized email
    const user = await User.findOne({ email: normalizedEmail }).lean();
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare passwords securely
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create secure JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h', algorithm: 'HS512' }
    );

    // Fetch role-specific data securely
    let roleData = {};
    if (user.role === 'commercant') {
      const commercant = await Commercant.findOne({ user: user._id }).lean();
      if (commercant) {
        roleData = {
          businessName: commercant.businessName,
          coins: commercant.coins
        };
      }
    } else if (user.role === 'client') {
      const client = await Client.findOne({ user: user._id }).lean();
      if (client) {
        roleData = {
          coins: client.coins,
          isInfluenceur: client.isInfluenceur,
          username_instagram: client.username_instagram
        };
      }
    }

    // Prepare the response with user data and JWT
    const userData = {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      token, // JWT returned in JSON response
      roleData
    };

    res.json({
      message: 'Login successful',
      user: userData
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
