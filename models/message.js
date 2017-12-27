const mongoose = require("mongoose")

var MessageSchema = new mongoose.Schema({
  content: String,
  date: {
    type: Date,
    default: Date.now
  },
  author: {
  	type: mongoose.Schema.Types.ObjectId,
  	ref: 'User'
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  wasDelivered: {
  	type: Boolean,
  	default: false
  },
  wasSeen: {
  	type: Boolean,
  	default: false
  }
});

module.exports = mongoose.model('Message', MessageSchema, 'Message')
