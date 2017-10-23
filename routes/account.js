const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')

const User = require('../models/user')
const Conversations = require('../models/conversation')
const Messages = require('../models/message')
var mongoose = require('mongoose');
module.exports = () => {
	router.post('/register', (req, res) => {
		console.log(req.body)
		User.create(req.body, (err, user) =>{
			if(err) {
				res.send({
					status: "error",
					user: null
				})
			}
			res.send({
				status: "ok",
				token: jwt.sign({id: user._id}, 'supersecretsecret', {
					expiresIn: "2h"
				})
			})
		})
	})

	router.post('/conversation', (req, res) => {
		console.log(req.body)
		Conversations.create({
			title: req.body.title,
			isPrivate: req.body.isPrivate,
			messages: req.body.messages,
			users: req.body.users.map(user => {
				return mongoose.Types.ObjectId(user)
			})
		}, (err, conversation) =>{
			if(err) console.log(err)
			res.send(conversation)
		})
	})

	router.post('/conversation/history', (req, res) => {
		jwt.verify(req.body.token, 'supersecretsecret', (verificationErr, decoded) => {
			if(verificationErr) res.send(verificationErr)
			console.log(decoded.id, req.body.id)
			Conversations.findOne({
				isPrivate: true,
				users: { $in: [decoded.id, req.body.id]}
			}, (conversationErr, conversation) => {	
				console.log(conversation)
				if(conversationErr) console.log(err)
				else if(conversation) {
					Messages.find({
						_id: { $in: conversation.messages}
					}, (messsagesErr, messages) => {
						if(messsagesErr) console.log(messages)
						res.send(messages)
					})
				}
				else {
					Conversations.create({
						title: "private",
						isPrivate: true,
						messages: [],
						users: [decoded.id, req.body.id]
					}, (err, newConversation) => {
						if(err) console.log(err)
						res.send(newConversation.messages)
					})
				}
			})

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