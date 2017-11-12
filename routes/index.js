const express 		= require('express')
const path 			= require('path')
const socketioJwt = require('socketio-jwt');
const mongoose = require('mongoose');

const Messages = require('../models/message')
const Users = require('../models/user')
const Conversations = require('../models/conversation')

const chat_controller = require('../controllers/chat_controller')
const conversation_controller = require('../controllers/conversation_controller')

let connectedUsers = []
module.exports = (app, db, io) => {

	app.use('/api', require('./account')())

	app.use('/api/chat', require('./chat')())

	app.use('/api/conversation', require('./conversation')())

	app.get('*', (req, res) => {
  		res.sendFile(path.join(__dirname, '../dist/index.html'));
	})
	
	io.set('authorization', socketioJwt.authorize({
		secret: 'supersecretsecret',
		handshake: true
	}))

	io.on('connection', socket => {
		socket.on("join", id => chat_controller.chat_connection(id, socket))
		socket.on("disconnect", () => chat_controller.chat_disconnection(socket))
		socket.on("new_message", (message, ack) => conversation_controller.new_message(message, ack, socket))
		socket.on("message_seen", message => chat_controller.message_seen(message, socket))
	})
}
