///Importing modules/ packages ///
var express = require('express');
var mongoose = require('mongoose');
var cool = require('cool-ascii-faces');
///Importing modules/ packages ///


/// Define Model ///
const UserModel = require('../models/users.js')
/// Define Model ///


var user = mongoose.model('UserModel');


const router = express();


router.get('/userfind',function(req,res){
    res.send(cool());
})


module.exports = router;