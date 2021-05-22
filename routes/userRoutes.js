///Importing modules/ packages ///
var express = require('express');
var mongoose = require('mongoose');
var cool = require('cool-ascii-faces');
const { success, error, validation } = require('../responses/responsesApi')
///Importing modules/ packages ///


/// Define Model ///
const UserModel = require('../models/users.js')
/// Define Model ///


var user = mongoose.model('UserModel');


const router = express();


router.get('/userfind',function(req,res){
    res.send(cool());
})

router.post('/login', function(request,response){
    var {email, password} = request.body
    user.findOne({ "email": email }, function (err, userDocument) {
        if (err) throw err;
        userDocument.comparePassword(password, function (err, isMatch) {
            if (err) throw err;
            if (isMatch) {
                // res.sendStatus(200)
                response.json(success("Ok", { data: "User Authenticated" }, response.statusCode))
            } else {
                // res.json({"user":"Password Invalid"});
                response.json(error("Password Invalid", response.statusCode))
                // res.json('user not found').sendStatus(200)
            }
        })
    })
})


router.post('/register', function(request, response){
   var {firstName,lastName, email, password} = request.body
   user.findOne({ "email": email }, function (err, alreadyUser) {
    if (err) throw err;
        if (alreadyUser) {
        console.log(alreadyUser);
         response.json(error("User already registered"), response.statusCode);

    } else {
        var userObject = new user({firstName: firstName, lastName:lastName, email:email, password:password})
        userObject.save(function(err,document){
        if(err)
        {
            throw err;
            response.sendStatus(400);
        }
        console.log(document)
        response.json(success("Ok", { data: document.id }, response.statusCode));

    });
}
});
});

module.exports = router;