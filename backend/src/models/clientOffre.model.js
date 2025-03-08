const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ClientOffreSchema = new Schema({
  client_id: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
  offre_id: { type: Schema.Types.ObjectId, ref: 'Offre', required: true },
  is_completed: { type: Boolean, default: false },
  date_utilisation: { type: Date }
});

const ClientOffre = mongoose.model('ClientOffre', ClientOffreSchema);

module.exports = ClientOffre;