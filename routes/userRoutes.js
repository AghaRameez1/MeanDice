///Importing modules/ packages ///
var express = require('express');
var mongoose = require('mongoose');
var cool = require('cool-ascii-faces');
var fs = require('fs');
const { success, error, validation } = require('../responses/responsesApi')
const multer = require("multer");
const router = express();


///Importing modules/ packages ///


/// Define Model ///
const UserModel = require('../models/users.js')
/// Define Model ///


var user = mongoose.model('UserModel');



var storage = multer.diskStorage(
    {
        destination: './uploads/',
        filename: function (req, file, cb) {
            cb(null, file.originalname);
        }
    }
);

var upload = multer({ storage: storage });

const handleError = (err, res) => {
  res
    .status(500)
    .contentType("text/plain")
    .end("Oops! Something went wrong!");
};

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
                response.json({
                    'code': 200,
                    'data':'Ok',
                    'message':'User Authenticated'
                })
            } else {
                // res.json({"user":"Password Invalid"});
                response.json({
                    'code': 404,
                    'data':'Error',
                    'message':'Invalid Password'
                })
                // res.json('user not found').sendStatus(200)
            }
        })
    })
})


router.post('/register', function(request, response){
   var {firstName1,lastName1, email1, password1} = request.body
   user.findOne({ "email": email1 }, function (err, alreadyUser) {
    if (err) throw err;
        if (alreadyUser) {
        console.log(alreadyUser);
         response.json({
             'data':'error',
             'message':'Email Already Registered'
         });

    } else {
        // var userObject = new user({firstName: firstName, lastName:lastName, email:email, password:password})
        var userObject = new user();
        userObject.firstName = firstName1;
        userObject.lastName = lastName1;
        userObject.email = email1;
        userObject.password = password1;
        var img = fs.readFileSync('./uploads/profileImage.png');
        var finalImage = {
            contentType:'image/png',
            data: new Buffer.from(img)
        }
        userObject.img = finalImage
        userObject.save(function(err,document){
        if(err)
        {
            throw err;
            response.sendStatus(400);
        }
        console.log(document)
        response.json({
            'data': document.id,
            'message':'success'
        });

    });
}
});
});


router.post('/profileImage', function(req,res){
    var {email1} = req.body
    user.findOne({ "email": email1 }, function (err, alreadyUser) {
        if (err) throw err;
            if (alreadyUser) {
            console.log(alreadyUser);
             res.json({
                 'data': alreadyUser.img,
             'message':'success'});
            }
        });
});

module.exports = router;