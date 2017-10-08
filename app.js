const express 		= require('express')
const mongoose 		= require('mongoose')
const bodyParser 	= require('body-parser')
const db 			= require('./config/db')
const path 			= require('path')


const app 	= express()
const port 	= 8000

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'dist')))


mongoose.connect(db.url, { useMongoClient: true }, database => {
	require('./routes')(app, database)
	app.listen(port, () => {
		console.log('We are live on ' + port)
	})
})         	 


//https://jsfiddle.net/fscf582h/3/ <--- fiddle to get exercises names