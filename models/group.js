const mongoose = require("mongoose")

var GroupShema = new mongoose.Schema({
  title: String,
  users: [{
	type: mongoose.Schema.Types.ObjectId,
  	ref: 'User'
  }],
  messages: [{
	type: mongoose.Schema.Types.ObjectId,
  	ref: 'Group_message'
  }]
});

module.exports = mongoose.model('Group', GroupShema, 'Group')
