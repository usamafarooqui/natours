const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs'); // npm i bcryptjs

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
        required:[true,'please confirm your password'],
        // adding a validation to confirm passwords
        validate:{
            // this only works on save and create 
            // el means cuurent element in our case password confirm
            validator:function(el){
                return el === this.password;
            },
            // error message
            message:'passwords are not the same'
        }
    }
});


// pre save is a doucument middleware
// passwords ka yahan hash krengay
// password ko database mein save honay se pehlay save krengay
userSchema.pre('save',async function(next){
    // agr passowrd modify nahi hota eg in updating only email
    // tou hash nahi krengay password
    // isModified express function hai jo dekhta hai document kb modify hua hai 
    if(!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 4);
    // confirmed password ko deletye krengay q k usko hash nahi krna
    this.passwordConfirm = undefined;

    next();
})


const User = mongoose.model('User',userSchema);

module.exports = User;