const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')

const User = require('../models/user')

module.exports = () => {
	router.post('/register', (req, res) => {
		User.create(req.body, (err, user) =>{
			if(err) console.log(err)
			res.send(user)
		})
	})
	router.post('/login', (req, res) => {
		User.findOne({ username: req.body.username }, (err, user) => {
			if(err) {
				res.send(err)
			}
			else if(!user) {
				res.json({ success: false, message: 'Authentication failed. User not found.' })
			}
			else {
				if(!user.validPassword(req.body.password)) {
					res.json({ success: false, message: 'Authentication failed. Wrong password.' });
				}
				else {
					let token = jwt.sign({id: user._id}, 'supersecretsecret', {
						expiresIn: "2h"
					})
					res.json({
						success: true,
						message: "Welcome!",
						token: token
					})
				}
			}
		})
	})
	return router;
}