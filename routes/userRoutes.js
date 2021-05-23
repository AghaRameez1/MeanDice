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
    console.log(req.query.id)
    user.findOne({ "_id": req.query.id }, function (err, userDocument) {
        if(userDocument){
            res.json({
                'code': 200,
                'data':'Ok',
                'message':'User Avaiable'
            });
        }else{
            res.json({
                'code': 400,
                'data':'error',
                'message':'User not avaiable'
            });
        }
    });
    // res.send(cool());
})

router.post('/login', function(request,response){
    var {email, password} = request.body
    user.findOne({ "email": email }, function (err, userDocument) {
        if (err) throw err;
            if(userDocument == null){
                response.json({
                    'code': 404,
                    'data':'Error',
                    'message':'Invalid email'
                })
            }
            else{
                userDocument.comparePassword(password, function (err, isMatch) {
            if (err) throw err;
            if (isMatch) {
                // res.sendStatus(200)
                response.json({
                    'code': 200,
                    'data':'Ok',
                    'message':'User Authenticated',
                    'id':userDocument.id
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
    }
    })
})


router.post('/register', function(request, response){
   var {firstName,lastName, email, password} = request.body
   user.findOne({ "email": email }, function (err, alreadyUser) {
    if (err) throw err;
        if (alreadyUser) {
        console.log(alreadyUser);
         response.json({
             'code':404,
             'data':'error',
             'message':'Email Already Registered'
         });

    } else {
        // var userObject = new user({firstName: firstName, lastName:lastName, email:email, password:password})
        var userObject = new user();
        userObject.firstName = firstName;
        userObject.lastName = lastName;
        userObject.email = email;
        userObject.password = password;
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
            'code':200,
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