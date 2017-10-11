const mongoose = require("mongoose")


var MessageSchema = new mongoose.Schema({
  content: String,
  date: {
    type: Date,
    default: Date.now
  },
  author: String
});


module.exports = mongoose.model('Message', MessageSchema, 'Message')