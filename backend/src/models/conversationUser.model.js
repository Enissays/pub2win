const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ConversationUserSchema = new Schema({
  conversation_id: { type: Schema.Types.ObjectId, ref: 'Conversation', required: true },
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  date_ajout: { type: Date, default: Date.now },
  notifications_actives: { type: Boolean, default: true }
});

const ConversationUser = mongoose.model('ConversationUser', ConversationUserSchema);

module.exports = ConversationUser;