const mongoose = require("mongoose")

var PostSchema = new mongoose.Schema({
  content: String,
  date: {
    type: Date,
    default: Date.now
  },
  author: {
  	type: mongoose.Schema.Types.ObjectId,
  	ref: 'User'
  },
});

module.exports = mongoose.model('Post', PostSchema, 'Post')
