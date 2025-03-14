const mongoose = require('mongoose');

async function getDbCollections() {
  const db = mongoose.connection.db;
  const collections = await db.listCollections().toArray();
  return collections.map(c => c.name);
}

module.exports = {
  getDbCollections
};