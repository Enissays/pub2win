const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  conversation_id: { type: Schema.Types.ObjectId, ref: 'Conversation', required: true },
  expediteur_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  contenu: { type: String, required: true },
  date_envoi: { type: Date, default: Date.now },
  is_read: { type: Boolean, default: false },
  date_lecture: { type: Date }
});

const Message = mongoose.model('Message', MessageSchema);

module.exports = Message;