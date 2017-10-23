const mongoose = require("mongoose")

var ConversationSchema = new mongoose.Schema({
  title: String,
  users: [{  		
	type: mongoose.Schema.Types.ObjectId,
  	ref: 'User'
  }],
  isPrivate: Boolean,
  messages: [{
	type: mongoose.Schema.Types.ObjectId,
  	ref: 'Message'
  }]
});


module.exports = mongoose.model('Conversation', ConversationSchema, 'Conversation')