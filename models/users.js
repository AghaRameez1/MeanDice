var mongoose = require('mongoose')
var crypto = require('crypto-js')

var userSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required: true
    },
    email:{
        type: String,
        unique: true,
        required: true
    },
    password:{
        type:String,
        required:true
    }
});

const UserModel = mongoose.model('UserModel', userSchema);