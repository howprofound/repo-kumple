const mongoose = require("mongoose")

var ConversationSchema = new mongoose.Schema({
  title: String,
  users: [{
	type: mongoose.Schema.Types.ObjectId,
  	ref: 'User'
  }]
});

module.exports = mongoose.model('Conversation', ConversationSchema, 'Conversation')
