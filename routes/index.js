const express 		= require('express')
const path 			= require('path')
const socketioJwt = require('socketio-jwt');


const Messages = require('../models/message')
const Users = require('../models/user')

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
		console.log('user connected')
	    socket.on('hello', (id, fn) => {
	    	connectedUsers.push({
	    		id: id, 
	    		socket: socket.id
	    	})
	    	io.emit('user-change', { id: id, connected: true })
	    	Users.find({}, (err, users) => {
    			fn(users.map(user => {
    				return {
    					username: user.username,
    					id: user._id
    				}
    			}), connectedUsers.map(cUser => {
    				return cUser.id
    			}))
    			Messages.find({}, (err, messages) => {
    				messages.forEach(message => {
    					socket.emit('message', { type: 'new-message', content: message.content, author: message.author })
    				})
    				
    			})
	    	})
	    })
	    socket.on('disconnect', function() {
	    	let disconnectedUser;
	    	connectedUsers = connectedUsers.filter(user => {
	    		if(user.socket !== socket.id) {
	    			return true
	    		}
	    		else {
	    			disconnectedUser = user.id
	    			return false
	    		}
	    		
	    	})
	    	io.emit('user-change', { id: disconnectedUser, connected: false })
	        console.log('user disconnected')
	    });
	    socket.on('add-message', (message) => {
	        io.emit('message', { type: 'new-message', content: message.content , author: message.author })
	        Messages.create({
	        	content: message.content,
	        	author: message.author
	        }, (err) => {
	        	console.log(err)
	        })
	    });
	    socket.on('clear', (message) => {
	        io.emit('message', {
	        	type: 'clear'
	        })
	        Messages.remove({}, (err) => {
	        	console.log(err)
	        })
	    });
	});
}