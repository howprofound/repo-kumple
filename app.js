const express 		= require('express'),
	mongoose 		= require('mongoose'),
	bodyParser 		= require('body-parser'),
	db 				= require('./config/db'),
	path 			= require('path'),
	app 			= express(),
	http 			= require('http').Server(app),
	io 				= require('socket.io')(http),
	port 			= 8000

app.use(bodyParser.urlencoded({ extended: false, limit: '5mb'}))
	.use(bodyParser.json())
	.use(express.static(path.join(__dirname, 'dist')))
	.use('/images', express.static(path.join(__dirname, 'public')))

mongoose.connect(db.url, { useMongoClient: true }, database => {
	require('./routes')(app, database, io)
	http.listen(port, () => {
		console.log('We are live on ' + port)
	})
})         	 


//https://jsfiddle.net/fscf582h/3/ <--- fiddle to get exercises names