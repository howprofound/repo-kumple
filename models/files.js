const mongoose = require("mongoose")

var PostSchema = new mongoose.Schema({
  fileName: String,
  fileOriginalName: String
});

module.exports = mongoose.model('Post', PostSchema, 'Post')
