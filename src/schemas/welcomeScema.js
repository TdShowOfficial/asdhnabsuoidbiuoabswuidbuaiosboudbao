const mongoose = require('mongoose');

const welcomeSchema = new mongoose.Schema({
  channel: String,
  guild: String
});

const welcomesetup = mongoose.model('welcomesetup', welcomeSchema);

module.exports = welcomesetup;