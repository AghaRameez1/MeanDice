///Importing modules/ packages ///
var express = require('express');
var mongoose = require('mongoose');
/// Added Body Parser ///
var bodyparser = require('body-parser');
/// Added Body Parser ///
var cors = require('cors')
var cool = require('cool-ascii-faces');
///Importing modules/ packages ///

///defining port ///
const port = 3000
///defining port ///


/// DATABASE CONNECTION ///
mongoose.connect('mongodb://localhost:27017/firstNode',{useNewUrlParser: true,
useUnifiedTopology: true,
useFindAndModify: false,
useCreateIndex: true })

mongoose.connection.on('connected',()=>{
    console.log('Connection Successful')
});
mongoose.connection.on('error',(err)=>{
    if(err){
    console.log('Connection Failed');
}
});
/// DATABASE CONNECTION ///

/// Importing routes ///
const route = require('./routes/userRoutes.js')
require('./models/users.js')
/// Importing routes ///

var app = express();
/// Defining Body Parsers ///
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use(bodyparser.raw());
/// Defining Body Parsers ///
app.use(cors());
app.use('/api',route)



app.get('/', function(req, res){
    res.send('Hello World')
});

app.get('/cool', function(req,res){
    res.send(cool())
});


/// start of the server ///
app.listen(port,()=>{
    console.log('server has start at port: ', port)
});
/// start of the server ///