const express        = require('express');
const MongoClient    = require('mongodb').MongoClient;
const bodyParser     = require('body-parser');
const db             = require('./config/db');
const index = require('./routes/index');

const app            = express();


const port = 8000;
__dirname + 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('views', __dirname + '\\views');
app.set('view engine', 'hbs');
app.use(express.static(__dirname +  '\\public'));

MongoClient.connect(db.url, (err, database) => {
	if (err) return console.log(err)
	require('./routes')(app, database);
	app.listen(port, () => {
		console.log('We are live on ' + port);
	});               
})


//https://jsfiddle.net/fscf582h/3/ <--- fiddle to get exercises names