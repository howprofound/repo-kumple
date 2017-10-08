var mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var SetSchema = new mongoose.Schema({
  reps: Number,
  weight: Number,
  exerciseId: {
  	type: ObjectId, ref: 'Exercise'
  }
});

module.exports = mongoose.model('Set', SetSchema, 'Sets')