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
  wasDelivered: {
  	type: Boolean,
  	default: false
  },
  wasSeen: {
  	type: Boolean,
  	default: false
  },
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation'
  }
});

module.exports = mongoose.model('Message', MessageSchema, 'Message')
