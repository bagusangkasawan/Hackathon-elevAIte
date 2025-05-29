const mongoose = require('mongoose');

const checkinSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  mood: String,
  description: String,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Checkin', checkinSchema);
