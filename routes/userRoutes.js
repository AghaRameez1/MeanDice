///Importing modules/ packages ///
var express = require('express');
var mongoose = require('mongoose');
var cool = require('cool-ascii-faces');
var fs = require('fs');
const { success, error, validation } = require('../responses/responsesApi')
var multer = require("multer");
var bcrypt = require('bcrypt')
const router = express();


const port = process.env.PORT || 3000

///Importing modules/ packages ///


/// Define Model ///
const UserModel = require('../models/users.js')
/// Define Model ///


var user = mongoose.model('UserModel');



var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/'); // folder path
      },
      filename: (req, file, cb) => {
        var imageUrl = '/'+file.originalname.replace(/\\/g, "/");
        cb(null, imageUrl);
        // cb(null, `${uuid()}.${mime.extension(file.mimetype)}`); // file name here
      }
    }
);

const upload = multer( {storage:storage} );

router.get('/userfind',function(req,res){
    user.findOne({ "_id": req.query.id }, function (err, userDocument) {
        if(userDocument){
            res.json({
                'code': 200,
                'data':{
                    'id':userDocument._id,
                    'firstName': userDocument.firstName,
                    'lastName': userDocument.lastName,
                    'email': userDocument.email,
                    'img': 'https://meandicemeanstack.herokuapp.com/public'+userDocument.img
                },
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
        // var img = fs.readFileSync('./public/uploads/profileImage.png');
        // console.log(img)
        // var finalImage = {
        //     contentType:'image/png',
        //     data: new Buffer.from(img)
        // }
        userObject.img = '/profileImage.png'
        userObject.save(function(err,document){
        if(err)
        {
            throw err;
            response.sendStatus(400);
        }
        response.json({
            'code':200,
            'data': document.id,
            'message':'success'
        });

    });
}
});
});


router.put('/updateUser',upload.single('image'),function(req,res){
    var {id,firstName,lastName,email,password}= req.body
    const salt = bcrypt.genSaltSync();
    const hash = bcrypt.hashSync(password, salt);
    var update = {
        firstName:firstName,
        lastName: lastName,
        email: email,
        password: hash,
        img: req.file.filename
    }
    
    user.findByIdAndUpdate({"_id":id }, update, function(err,userDocument){
        if(err) throw err;
        res.json({
            'code': 200,
            'data':{
                'id':userDocument._id,
                'firstName': userDocument.firstName,
                'lastName': userDocument.lastName,
                'email': userDocument.email,
                'img': 'https://meandicemeanstack.herokuapp.com/public'+userDocument.img
            },
            'message':'User Avaiable'
        });
    })
})

router.post('/profileImage', function(req,res){
    var {email} = req.body
    user.findOne({ "email": email }, function (err, alreadyUser) {
        if (err) throw err;
            if (alreadyUser) {
             res.json({
                 'data': alreadyUser.img,
             'message':'success'});
            }
        });
});

module.exports = router;