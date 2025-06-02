import mongoose from 'mongoose';
import User from './user.model.js';

const commercantSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  businessName: { type: String, required: true },
  coins: { type: Number, default: 0 }
});

export default mongoose.model('Commercant', commercantSchema);