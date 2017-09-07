var ObjectID = require('mongodb').ObjectID;
var async = require('async');


module.exports = function(app, db) {
	getExercises = exercises => {
		return db.collection('Exercises').find({
			_id: { $in: exercises}
		}).toArray()	
	}
	getWorkouts = () => {
		return db.collection('Workouts').find().toArray()
	}
	app.get('/', (req, res) => {
		getWorkouts().then(workouts => {
			var promises = []
			workouts.forEach(workout => {
				promises.push(
					getExercises(workout.exercises).then(exercises => {
					workout.exercises = exercises
				}))
			})
			Promise.all(promises).then(() => {
				res.render('index', { workouts: workouts})
			})
		})
	});
	app.post('/workout', (req, res) => {
		const note = { 
			title: req.body.title, 
			date: req.body.date,
			comment: req.body.comment,
			exercises: []
		};
		db.collection('Workouts').insert(note, (err, result) => {
			if (err) { 
				res.send({ 'error': 'An error has occurred' }); 
			} 
			else {
				res.send(result.ops[0]);
			}
		});
	});
	app.post('/exercise', (req, res) => {
		const workoutId = req.body.workoutId
		const exercise = {
			name: req.body.name,
			comment: req.body.comment,
			sets: []
		}
		db.collection('Exercises').insert(exercise, (err, result) => {
			if(err) {
				res.send(err);
			}
			else {
				const details = {_id: new ObjectID(workoutId)}
				db.collection('Workouts').update(details, {
					$push: { exercises: result.ops[0]._id}
				}, (err, updateResult) => {
					if(err) {
						res.send(err);
					}
					else {
						res.send({
							exercise: result.ops[0]._id,
							workout: "ok"
						})
					}
				})
			}
		})
	})
	app.post('/exerciseName', (req, res) => {
		db.collection('ExercisesNames').insert(req.body, (err, result) => {
			if (err) { 
				res.send({ 'error': 'An error has occurred' }); 
			} 
			else {
				res.send(result);
			}
		});
	});
};