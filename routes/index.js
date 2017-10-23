const express 		= require('express')
const path 			= require('path')
const socketioJwt = require('socketio-jwt');


const Messages = require('../models/message')
const Users = require('../models/user')
const Conversations = require('../models/conversation')

var mongoose = require('mongoose');

let connectedUsers = []
module.exports = (app, db, io) => {

	app.use('/api', require('./account')(db))

	app.get('*', (req, res) => {
  		res.sendFile(path.join(__dirname, '../dist/index.html'));
	})
	
	io.set('authorization', socketioJwt.authorize({
		secret: 'supersecretsecret',
		handshake: true
	}))

	io.on('connection', (socket) => {
		console.log("user connected")
		socket.on('hello', (id, callback) => {
			Users.find({_id: {"$ne": id}}, (err, users) => {
				if(err) console.log(err)
				else {
					callback(users.map(user => {
						return {
							id: user._id,
							username: user.username,
							isActive: connectedUsers.find(cUser => cUser.id == user._id) ? true : false // == because we want to convert _id.toString()
						}
					}))
				}
				socket.broadcast.emit('user-change', {id: id, isActive: true})
				connectedUsers.push({
					id: id,
					socketId: socket.id
				})
				console.log(connectedUsers)
			})
		})
		socket.on("disconnect", () => {
			let dcUser;
			connectedUsers = connectedUsers.filter(user => {
				if(user.socketId !== socket.id)
					return true
				else {
					dcUser = user.id
					return false
				}
			})
			io.emit('user-change', {id: dcUser, isActive: false})
			Users.findOneAndUpdate({
				_id: dcUser
			}, {
				$set: { lastLogin: Date.now() }
			}, err => {
				if(err) console.log(err)
			})
			console.log("user disconnected")
		})
		socket.on("new-message", message => {
			Messages.create({
				content: message.content,
				author: message.author
			}, (err, messageInstance) => {
				if(err) console.log(err)
					console.log(message.author, message.conversation)
				Conversations.findOneAndUpdate({
					isPrivate: true,
					users: { $all: [message.author, message.conversation] }
				}, {
					$push: { messages: messageInstance._id}
				}, err => {
					if(err) console.log(err)
					console.log("all ok!")
					console.log(message.conversation)
					let target = connectedUsers.find(user => user.id === message.conversation)
					console.log(target)
					if(target) {
						io.to(target.socketId).emit("new-message", {
							content: message.content,
							author: message.author
						})
					}
					socket.emit("new-message", {
						content: message.content,
						author: message.author
					})
				})
			})
		})
	})
}