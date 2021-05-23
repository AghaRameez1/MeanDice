/// Defining Models ///


var mongoose = require('mongoose')
var bcrypt = require('bcrypt')

var userSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required: true
    },
    lastName:{
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
    },
    img: { 
        data: Buffer, 
        contentType: String 
     }
});
/// Defining Models ///

/// Saving with hash password ///
userSchema.pre('save', function(next){
    var user = this;
    if(!user.isModified('password')) return next

    bcrypt.genSalt(10, function(err, salt){
        if (err)throw err;

        bcrypt.hash(user.password, salt, function(err, hash){
            if(err) throw err;
            user.password = hash;
            next();
        });
    });
});
/// Saving with hash password ///

/// Compare Passowrd ///
userSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};
/// Compare Passowrd ///

/// Naming Model ///
const UserModel = mongoose.model('UserModel', userSchema);
/// Naming Model ///