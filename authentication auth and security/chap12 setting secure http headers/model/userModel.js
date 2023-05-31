const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A user must have a name']
    },
    email: {
        type: String,
        required: [true, 'A user must have a email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'please provide valid email address']
    },
    photo: String,

    role: {
        type: String,
        enum: ['user', 'guide', 'lead-guide', 'admin'],
        default: 'user',
    },
    password: {
        type: String,
        required: [true, 'please provide a password'],
        minlength: 8,
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, 'please confirm your password'],
        // adding a validation to confirm passwords
        validate: {
            // this only works on save and create 
            validator: function (el) {
                return el === this.password;
            },
            message: 'passwords are not the same'
        }
    },
    // ye bus password change honay pe apply hogi
    passwordChangedAt: Date,
    //password reset token aur password expires ki field bnao
    passwordResetToken: String,
    passwordResetExpires: Date,
    active:{
        type:Boolean,
        default:true,
        select:false
    }

});

// passwords ka yahan hash krengay
// password ko database mein save honay se pehlay save krengay
userSchema.pre('save', async function (next) {
    // agr passowrd modify nahi hota eg in updating only email
    // tou hash nahi krengay password
    // isModified express function hai jo dekhta hai document kb modify hua hai 
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 4);
    // confirmed password ko deletye krengay q k usko hash nahi krna
    this.passwordConfirm = undefined;

    next();
})

// delete wali query k liye khali wo user send krengay jinka active status true hon
// /^find/ iska mtlb sari find queries
userSchema.pre(/^find/,function(next){
    // this points to the current query
    this.find({active:{$ne:false}});
    next();
})

// passwordchangeAT yahan bnao
userSchema.pre('save',function(next){
    // agr password modify ya change nahi hua ya new hai  tou direct next krdega
    if(!this.isModified('password') || this.isNew) return next();
    // -1000 krna trick hai in case db se data slow jaye
    this.passwordChangedAt = Date.now()-1000;
    next();
})

// yahan instance function bnayegay jo password compare krengay 
// instance function wo hotay hn jo har document k liye available hon
// correctPassword function ka naam hai
// instance method mein this current document ko indicate krta hai
userSchema.methods.correctPassword = async function (candiatePassword, userPassword) {
    return await bcrypt.compare(candiatePassword, userPassword);
};

// change password function 
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    // agr kabhi password change hua ho
    if (this.passwordChangedAt) {
        // dono time stamp alag format mein hn passwordchangeAt ko second mein krnay k liye
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10) // 10 yani base 10 number hai
        // console.log(this.passwordChangedAt , JWTTimestamp);
        // iske true honay ka mtlb password change hua hai
        return JWTTimestamp < changedTimestamp;
    }
    // by default ye value false hogi yani not change
    return false;
}

// password reset function
const crypto = require('crypto');

userSchema.methods.createPasswordResetToken = function(){
    // password ki tarah resettoken bhi kabhi plain database mein nahi jani chaiye is liye 
    // node k built in module se encrypt krdia hai
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    this.passwordResetExpires = Date.now() + 10*60*1000; // iska mtlb 10 min hongay password reset krnay k liye
    // console.log({resetToken}, this.passwordResetToken);

    return resetToken;

}

const User = mongoose.model('User', userSchema);

module.exports = User;