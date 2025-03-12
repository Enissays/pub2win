const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./user.model');

const ClientSchema = new Schema({
  coins: { type: Number, default: 0 },
  isInfluenceur: { type: Boolean, default: false },
  lien_compte_instagram: { type: String },
  username_instagram: { type: String }
});

const Client = User.discriminator('Client', ClientSchema); 

module.exports = Client;