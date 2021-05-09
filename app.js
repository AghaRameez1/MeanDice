var express = require('express');
var mongoose = require('mongoose')
var cors = require('cors')
var cool = require('cool-ascii-faces');




const port = 3000
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
const route = require('./routes/userRoutes.js')
require('./models/users.js')
var app = express();


app.use(cors());
app.use('/api',route)



app.get('/', function(req, res){
    res.send('Hello World')
});

app.get('/cool', function(req,res){
    res.send(cool())
});

app.listen(port,()=>{
    console.log('server has start at port: ', port)
});
