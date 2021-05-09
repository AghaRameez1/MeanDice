var express = require('express');
var mongoose = require('mongoose');
var cool = require('cool-ascii-faces');

const UserModel = require('../models/users.js')

var user = mongoose.model('UserModel');


const router = express();


router.get('/userfind',function(req,res){
    res.send(cool());
})


module.exports = router;