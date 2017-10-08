var mongoose = require("mongoose")

var WorkoutSchema = new mongoose.Schema({
  name: String,
  date: {
    type: Date,
    default: Date.now
  },
  comment: String
});


module.exports = mongoose.model('Workout', WorkoutSchema, 'Workouts')