const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const AideSchema = new Schema({
  email: {type: String,required: true },
  telephone: {  type: String,required: true },
  facebook_url: {  type: String },
  instagram_url: { type: String },
  twitter_url: {  type: String },
});
const Aide = mongoose.model('Aide', AideSchema);
module.exports = Aide;