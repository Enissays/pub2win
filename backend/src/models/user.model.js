const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { RoleEnum } = require('./enums');

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password_hash: { type: String, required: true },
  isBanned: { type: Boolean, default: false },
  isTimeouted: { type: Boolean, default: false },
  finBan: { type: Date },
  role: { type: String, enum: Object.values(RoleEnum), required: true },
  date_inscription: { type: Date, required: true }, // TODO: fill with date now 
}, { 
  discriminatorKey: 'userType',
  timestamps: true 
});

const User = mongoose.model('User', UserSchema);

module.exports = User;