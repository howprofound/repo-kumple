const express 		= require('express')
const path 			= require('path')


const Messages = require('../models/message')

module.exports = (app, db, io) => {

	app.get('*', (req, res) => {
  		res.sendFile(path.join(__dirname, '../dist/index.html'));
	})
	app.use('/api', require('./account')(db))

	io.on('connection', (socket) => {
		Messages.find({}, (err, messages) => {
			messages.forEach(message => {
				socket.emit('message', { type: 'new-message', content: message.content, author: message.author })
			})
			
		})
	    console.log('user connected')
	    socket.on('disconnect', function() {
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