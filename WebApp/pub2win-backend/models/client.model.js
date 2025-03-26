import mongoose from 'mongoose';
import User from './user.model.js';

const clientSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true, 
    unique: true 
  },
  coins: { 
    type: Number, 
    default: 0 
  },
  isInfluenceur: { 
    type: Boolean, 
    default: false 
  },
  username_instagram: { 
    type: String 
  }
});

export default mongoose.model('Client', clientSchema);