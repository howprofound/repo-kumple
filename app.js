const express 		= require('express')
const mongoose 		= require('mongoose')
const bodyParser 	= require('body-parser')
const db 			= require('./config/db')
const path 			= require('path')
const app 			= express()
const http 			= require('http').Server(app);
const io 			= require('socket.io')(http);
const port 	= 8000

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'dist')))

io.on('connection', (socket) => {
    console.log('user connected');
    socket.on('disconnect', function() {
        console.log('user disconnected');
    });
    socket.on('add-message', (message) => {
        io.emit('message', { type: 'new-message', text: message });
        // Function above that stores the message in the database
       //databaseStore(message)
    });

});



mongoose.connect(db.url, { useMongoClient: true }, database => {
	require('./routes')(app, database)
	http.listen(port, () => {
		console.log('We are live on ' + port)
	})
})         	 


//https://jsfiddle.net/fscf582h/3/ <--- fiddle to get exercises names