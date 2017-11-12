const mongoose = require("mongoose")

var Group_messageSchema = new mongoose.Schema({
  content: String,
  date: {
    type: Date,
    default: Date.now
  },
  author: {
  	type: mongoose.Schema.Types.ObjectId,
  	ref: 'User'
  },
  wasSeenBy: [{
  type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  groupId: {
  	type: mongoose.Schema.Types.ObjectId,
  	ref: 'Group'
  }
});

module.exports = mongoose.model('Group_message', Group_messageSchema, 'Group_message')
