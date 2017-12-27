const express 		= require('express'),
	mongoose 		= require('mongoose'),
	bodyParser 		= require('body-parser'),
	db 				= require('./config/db'),
	path 			= require('path'),
	app 			= express(),
	http 			= require('http').Server(app),
	shared 			= require('./config/shared')
	port 			= 8000;
var io = shared.io
io = require('socket.io')(http),
shared.setIo(io)
app.use(bodyParser.urlencoded({ extended: false, limit: '5mb'}))
	.use(bodyParser.json())
	.use(express.static(path.join(__dirname, 'dist')))
	.use('/images', express.static(path.join(__dirname, 'public')))

mongoose.connect(db.url, { useMongoClient: true }, database => {
	require('./routes')(app, database, io)
	http.listen(process.env.PORT || 8080, () => {
		console.log('We are live on ' + port)
	})
})         	 
