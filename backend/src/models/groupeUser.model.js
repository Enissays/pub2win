const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { GroupeRoleEnum } = require('./enums');

const GroupeUserSchema = new Schema({
  groupe_id: { type: Schema.Types.ObjectId, ref: 'Groupe', required: true },
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  date_ajout: { type: Date, default: Date.now },
  role: { type: String, enum: Object.values(GroupeRoleEnum), default: GroupeRoleEnum.MEMBRE }
});

const GroupeUser = mongoose.model('GroupeUser', GroupeUserSchema);

module.exports = GroupeUser;