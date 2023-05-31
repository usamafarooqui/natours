const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true, 'A user must have a name']
    },
    email:{
        type:String,
        required:[true,'A user must have a email'],
        unique:true,
        lowercase:true,
        // validating the email by validator package
        validate:[validator.isEmail,'please provide valid email address']
    },
    photo:String,
    password:{
        type:String,
        required:[true,'please provide a password'],
        minlength:8
    },
    passwordConfirm:{
        type:String,
        required:[true,'please confirm your password']
    }
});

const User = mongoose.model('User',userSchema);

module.exports = User;