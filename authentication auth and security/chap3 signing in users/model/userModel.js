const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

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
        minlength:8,
        // select ko off krnay se ye kahin bhi output mein nahi jayega
        select:false
    },
    passwordConfirm:{
        type:String,
        required:[true,'please confirm your password'],
        // adding a validation to confirm passwords
        validate:{
            // this only works on save and create 
            validator:function(el){
                return el === this.password;
            },
            message:'passwords are not the same'
        }
    }
});

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


// yahan instance function bnayegay jo password compare krengay 
// instance function wo hotay hn jo har document k liye available hon on a certain collection
// correctPassword function ka naam hai
userSchema.methods.correctPassword = async function(candiatePassword , userPassword){
    return await bcrypt.compare(candiatePassword, userPassword);
};

const User = mongoose.model('User',userSchema);

module.exports = User;