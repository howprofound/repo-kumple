const path = require('path')
const socketioJwt = require('socketio-jwt')
const jwt = require('jsonwebtoken')
const fs = require('fs')
const chat_controller = require('../controllers/chat_controller')

module.exports = (app, db, io) => {
	app.use(/^\/api\/(?!(login|register)).*$/, (req, res, next) => {
		jwt.verify(req.headers.authorization, 'supersecretsecret', (err, decoded) => {
			if(err) {
				res.send({
					status: "authorization_error"
				})
			}
			else {
				req.userID = decoded.id
				next()
			}
		})
	})
	app.use('/api', require('./account')())

	app.use('/api/chat', require('./chat')())

	app.use('/api/conversation', require('./conversation')())

	app.use('/api/calendar', require('./event')())

	app.get('*', (req, res) => {
  		res.sendFile(path.join(__dirname, '../dist/index.html'));
	})

	io.set('authorization', socketioJwt.authorize({
		secret: 'supersecretsecret',
		handshake: true
	}))

	io.on('connection', socket => {
		socket.on("join_calendar", userId => chat_controller.calendar_connection(userId, socket))
		socket.on("join_chat", userData => chat_controller.chat_connection(userData, socket))
		socket.on("disconnect", () => chat_controller.chat_disconnection(socket))
		socket.on("new_message", (message, ack) => chat_controller.new_message(message, ack, socket))
		socket.on("message_seen", data => chat_controller.message_seen(data, socket))
		socket.on("new_group_message", (message, ack) => chat_controller.new_group_message(message, ack, socket))
		socket.on("group_message_seen", data => chat_controller.group_message_seen(data, socket))
		socket.on("add_user_to_group", data => chat_controller.add_user_to_group(data, socket))
		socket.on("delete_user_from_group", data => chat_controller.delete_user_from_group(data, socket))
		socket.on("group_conversation_create", (data, ack) => chat_controller.group_conversation_create(data, socket, ack))
		socket.on("group_conversation_delete", data => chat_controller.group_conversation_delete(data, socket))
		
	})
}
