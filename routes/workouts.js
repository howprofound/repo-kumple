const Workouts = require('../models/workout')
const Exercises = require('../models/exercise')
const Sets = require('../models/set')
var async = require('async');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId

module.exports = (router, db) => {
	router.get('/workouts', (req, res) => {
		Workouts.find({}, (err, results) => {
			if(err) {
				console.log(err)
			}
			else {
				res.send(results)
			}	
		})
	})
	router.post('/workout', (req, res) => {
		Workouts.create(req.body, (err, result) => {
			if(err) {
				console.log(err)
			}
			else {
				res.send(result)
			}
		})
	})
	router.get('/workout/:workoutId', (req, res) => {
		let id = req.params.workoutId
		Workouts.findOne({_id: new ObjectId(id)}, (err, result) => {
			if(err) {
				console.log(err)
			}
			else {
				res.send(result)
			}
		})
	})
	router.post('/workout/:workoutId/exercise', (req, res) => {
		let workoutId = req.params.workoutId
		let nameId  = req.body.name
		let id = new ObjectId()
		let exercise = {
			nameId: new ObjectId(nameId),
			workoutId: new ObjectId(workoutId),
			comment: req.body.comment,
			_id: id

		}
		Exercises.create(exercise, (err, result) => {
			let exerciseSets = req.body.sets.map(set => {
				return {
					exerciseId: id,
					weight: set.weight,
					reps: set.reps
				}
			})
			Sets.create(exerciseSets, (e, r) => {
				res.send({exercise: result, sets: r})
			})
		})
	})
	return router;
}
