const User = require('../model/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const jwt = require('jsonwebtoken');
// send mail
const sendEmail = require('../utils/email')
// to use promiify from express built in libarary
const { promisify } = require('util');
const crypto = require('crypto');




const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
}

// send token a 1 refactory function

const createSendToken = (user , statusCode , res)=>{
    const token = signToken(user._id);

    res.status(statusCode).json({
        status: 'success',
        token,
        data:{
            user
        }

    })
}

// create a user 

exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
    });

    // createSendToken(newUser , 201 , res);
    const token = signToken(newUser._id);

    res.status(201).json({
        status: 'success',
        token,
        data: {
            user: newUser
        }
    })
});



exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new AppError('please provide email and passowrd'), 400);
    }

    const user = await User.findOne({ email }).select('+password');

    // lets match user and password
    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('incorrect email or password'), 401);
    }

    // 3) if everything is ok send token to client 
    const token = signToken(user._id);

    res.status(200).json({
        status: 'success',
        token

    })

});



// protecting getalltours route

exports.protect = catchAsync(async (req, res, next) => {
    // 1) getting token and check if its there

    let token;

    // jwt mein token header bhejnay ka standard tareeka hota hai 
    // header mein authorization ayega aur uski value mein start mein Bearer 
    // ab usko check krnay k liye 
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        // Bearer hsjahjashj bearer k bad wali value ko get krnay k liye 
        token = req.headers.authorization.split(' ')[1];
    }

    // agr token na mile tou
    if (!token) {
        return next(new AppError('You are not logged in please log in to access'), 401)
    }
    // 2) verification of the token 

    // jwt khud hi verify krleta hai jwt.verify k zariye
    // ye 1 promise return krta hai is liye promisify
    const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    // console.log(decode);


    // 3) check if user still exists 
    // yani kbhi token bnaya ho uske bad us user ko delete hojaye tou token bhi khatm hojana chaiye
    const currentUser = await User.findById(decode.id);
    if (!currentUser) {
        return next(new AppError('the user belonging to this token does not exist', 401));
    }


    // 4) check if user changed password after the token was issued 
    // jb bhi token bnta hai iat yani issued at assigned hojata hai
    if (currentUser.changedPasswordAfter(decode.iat)) {
        return next(new AppError('user change passoword please log in again'), 401);
    }


    // lets put entire user data on request(for future)
    req.user = currentUser;
    next();
});



//yahan permission denay ka function bnao

// middle ware mein parameter nahi de saktay is liye 1 function bnaye gay then us mein middleware function bnayegay 

exports.restrictTo = (...roles) => {
    // yahan ab middleware function bnayegay
    return (req, res, next) => {
        // uper req.user mein pura user object hai wahan se role nikal jayega
        if (!roles.includes(req.user.role)) {
            return next(new AppError('You dont have permission to access this route'), 403)
        }

        next();
    }
}


// forgot password functionality
exports.forgotPassword = catchAsync(async (req, res, next) => {
    // 1) get user based on posted email address
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new AppError('no user found with this email address'),404)
    }

    // 2) generate random reset token 
    // user model mein ja k iska instance method create krna prega
    // model se yahan instance function lengay
    const resetToken = user.createPasswordResetToken();
    // is createPasswordResetToken mein kuch save nahi kraya 
    // abhi save krana prega
    // validateBeforeSave:false se sare validators hat jayengay for checking
    await user.save({ validateBeforeSave: false });

    // 3) email to users mail 
    // req.protocol se humain http ya https mil jayega
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
    console.log(resetURL)

    const message = `FORGET YOUR PASSWORD ? SUBMIT A PATCH REQUEST WITH YOUR NEW PASSWORD AND PASSWORD CONFIRM TO:${resetURL}.\n if you dint forget your password ignore this email`


    // try catch is liye dala hai takay agr error aye tou catch mein jo token han unsab ki value undefine kr k delete krden

    try {
        await sendEmail({
            email:user.email,
            subject:'your password reset token valid for 10 minutes',
            message
        })
        
        res.status(200).json({
            status: 'success',
            message:'token sent to email'
    
        })
    } catch (error) {
        user.createPasswordResetToken = undefined;   
        user.createPasswordResetExpires = undefined;   
        // ye data modify krta save nahi is ye yahan save kia
        await user.save({ validateBeforeSave: false });

        return next(new AppError('there was a error sending the email.try again later '),500)
    }

  

});


// password reset functionality 
exports.resetPassword = catchAsync(async(req, res, next) => { 
    // 1) get user based on the token
    // token email mein simple hai but database mein crypted hai usko match krnay k liye simple password ko bhi enrypt krengay
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    // user ko token k zariye find krengay aur dekhaingay k token expire hai k nahi
    //                                                                  password reset dekhaingay agr ye greater hai majooda date se tou yani token expire nahi hua
    const user = await User.findOne({passwordResetToken: hashedToken , passwordResetExpires:{$gt:Date.now()}});

    // 2) set new password if toekn has not expired and there is a user set new password 

    if(!user){
        return next(new AppError('token is invalid or has expired ',400))
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    // ye sab uper body ko modify krega magr save nahi krega
    // save sare validators bhi run krega update nahi krega ye
    await user.save();



    // 3) update changepasswordAt property for the user  (do in model)

    // 4)  log the user in and send jwt
    const token = signToken(user._id);

    res.status(200).json({
        status: 'success',
        token

    })
});



// update password without forgeting and reseting 

exports.updatePassword = catchAsync(async(req, res, next)=>{
    // 1) get user from the collections 
    const user = await User.findById(req.user.id).select('+password');

    // 2) check if posted current password is correct 
    if(!(await user.correctPassword(req.body.passwordCurrent , user.password))){
        return next(new AppError('your current password is wrong ', 401));
    }

    // 3) if password is correct then update 
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save(); // user.findbyidandupdate will not work


    // login user and send jwt
    createSendToken(user , 200 , res);
})