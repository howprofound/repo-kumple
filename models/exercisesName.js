var mongoose = require("mongoose")

var ExerciseNameSchema = new mongoose.Schema({
  name: String
});


module.exports = mongoose.model('ExercisesName', ExerciseNameSchema, 'ExercisesNames')