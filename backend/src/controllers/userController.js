const UserDAO = require('../repository/user.dao');
const Client = require('../models/client.model');

exports.updateProfile = async (req, res) => {
    try {
        const updates = req.body;
        const user = await UserDAO.getUserByUsername(req.user.username); // TODO: Get user ID from token

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
        const user = await UserDAO.getUserByUsername(req.query.username); // TODO: Get user ID from token
        await user.deleteOne();
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
        const client = await Client.findOne({ userId: req.user.userId }); // TODO: Get user ID from token
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

exports.getProfile = async (req, res) => {
    try {
        const user = await UserDAO.getUserByUsername(req.params.username);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
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
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during profile retrieval'
        });
    }
}

// Add these new controller methods

// Handle user registration
exports.registerUser = async (req, res) => {
  try {
    // User is already created/synced by the syncUser middleware
    // We can use this endpoint to add additional user data
    const { userId, userType, phoneNumber } = req.body;
    
    // The user is already available as req.user from the syncUser middleware
    const user = req.user;
    
    // Update any additional fields
    if (phoneNumber) {
      user.telephone = phoneNumber;
    }
    
    // Set user type if provided
    if (userType === 'influencer' && user.role === 'CLIENT') {
      user.isInfluenceur = true;
    }
    
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: user._id,
        clerkId: user.clerkId,
        email: user.email,
        name: `${user.prenom} ${user.nom}`,
        role: user.role,
        isInfluencer: user.isInfluenceur || false
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Error registering user',
      error: error.message
    });
  }
};

// Handle user login
exports.loginUser = async (req, res) => {
  try {
    // User is already authenticated by Clerk and synced by middleware
    // We can use this endpoint to log login activity or return additional user data
    const user = req.user;
    
    // Update last login timestamp
    user.derniere_connexion = new Date();
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'Login successful',
      user: {
        id: user._id,
        clerkId: user.clerkId,
        email: user.email,
        name: `${user.prenom} ${user.nom}`,
        role: user.role,
        isInfluencer: user.isInfluenceur || false
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Error during login',
      error: error.message
    });
  }
};

// Handle OAuth login
exports.oauthLogin = async (req, res) => {
  try {
    // Similar to regular login but for OAuth users
    const { provider } = req.body;
    const user = req.user;
    
    // Update last login timestamp and OAuth provider info
    user.derniere_connexion = new Date();
    user.oauth_provider = provider || 'unknown';
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'OAuth login successful',
      user: {
        id: user._id,
        clerkId: user.clerkId,
        email: user.email,
        name: `${user.prenom} ${user.nom}`,
        role: user.role,
        isInfluencer: user.isInfluenceur || false
      }
    });
  } catch (error) {
    console.error('OAuth login error:', error);
    res.status(500).json({
      success: false,
      message: 'Error during OAuth login',
      error: error.message
    });
  }
};