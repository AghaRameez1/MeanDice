///Importing modules/ packages ///
const path = require("path");
const fs = require("fs");
var express = require('express');
var mongoose = require('mongoose');
/// Added Body Parser ///
var bodyparser = require('body-parser');
/// Added Body Parser ///
var cors = require('cors')
var cool = require('cool-ascii-faces');
///Importing modules/ packages ///

///defining port ///
const port = process.env.PORT || 3000
///defining port ///
var settings = require('./config/config')
console.log(settings)

/// DATABASE CONNECTION ///
mongoose.connect(settings.mogoosevariable,{useNewUrlParser: true,
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
const route = require('./routes/userRoutes.js');
require('./models/users.js')
/// Importing routes ///

var app = express();
/// Defining Body Parsers ///

app.use(bodyparser.json());
app.use(bodyparser.raw());
app.use(bodyparser.urlencoded({ extended: true }));
/// Defining Body Parsers ///


app.use(cors());
app.use('/public',express.static(path.join(__dirname, "./public")));



app.use('/api',route)

app.get('/', function(req, res){
    res.send('Hello World')
});

app.get('/cool', function(req,res){
    res.send(cool())
});




app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", 'Content-Type, Authorization, Content-Length, X-Requested-With');
    res.header("Access-Control-Allow-Methods", "PUT, POST, GET, OPTIONS, DELETE");
    next();
});



/// start of the server ///
app.listen(port,()=>{
    console.log('server has start at port: ', port)
});
/// start of the server ///