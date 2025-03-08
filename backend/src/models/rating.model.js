const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RatingSchema = new Schema({
  auteur_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  user_rated_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  commentaire: { type: String },
  rate: { type: Number, required: true, min: 0, max: 5 },
  date: { type: Date, default: Date.now }
});

const Rating = mongoose.model('Rating', RatingSchema);

module.exports = Rating;