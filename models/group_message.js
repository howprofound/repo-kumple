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
  wasDelivered: {
  	type: Boolean,
  	default: false
  },
  wasSeenBy: [{
  type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  groupId: {
  	type: mongoose.Schema.Types.ObjectId,
  	ref: 'Group'
  },
  isFile: {
    type: Boolean,
    default: false
  },
  fileId: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Files'
  }]
});

module.exports = mongoose.model('Group_message', Group_messageSchema, 'Group_message')
