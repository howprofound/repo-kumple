var mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var ExerciseSchema = new mongoose.Schema({
  nameId: {
  	type: ObjectId, ref: 'ExerciseName'
  },
  workoutId: {
  	type: ObjectId, ref: 'Workout'
  },
  comment: String

});


module.exports = mongoose.model('Exercise', ExerciseSchema, 'Exercises')