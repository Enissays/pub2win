const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./user.model');

const CommercantSchema = new Schema({
  coins: { type: Number, default: 0 }
});

const Commercant = User.discriminator('Commercant', CommercantSchema);

module.exports = Commercant;