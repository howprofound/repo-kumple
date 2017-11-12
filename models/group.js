const mongoose = require("mongoose")

var GroupShema = new mongoose.Schema({
  title: String,
  users: [{
	type: mongoose.Schema.Types.ObjectId,
  	ref: 'User'
  }]
});

module.exports = mongoose.model('Group', GroupShema, 'Group')
