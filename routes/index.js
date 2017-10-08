const express = require('express')
const router = express.Router()
const path = require('path')

const workouts 		= require('./workouts')

module.exports = (app, db) => {
	app.use('/api', workouts(router, db))

	app.get('*', (req, res) => {
  		res.sendFile(path.join(__dirname, '../dist/index.html'));
	});

}