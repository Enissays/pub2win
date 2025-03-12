const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ConversationSchema = new Schema({
  titre: { type: String, required: true },
  date_creation: { type: Date, default: Date.now },
  is_active: { type: Boolean, default: true }
});

const Conversation = mongoose.model('Conversation', ConversationSchema);

module.exports = Conversation;