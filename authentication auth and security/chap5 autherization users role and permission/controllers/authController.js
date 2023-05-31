const User = require('../model/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const jwt = require('jsonwebtoken');

// to use promiify from express built in libarary
const {promisify} = require('util')




const signToken = id =>{
    return jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRES_IN
    });
}



// create a user 

exports.signup = catchAsync(async (req, res , next)=>{
    const newUser = await User.create({
        name:req.body.name,
        email:req.body.email,
        password:req.body.password,
        passwordConfirm:req.body.passwordConfirm
    });
   

    const token = signToken(newUser._id);

    res.status(201).json({
        status:'success',
        token,
        data:{
            user: newUser
        }
    })
});



exports.login= catchAsync(async(req,res,next)=>{
    const {email,password}=req.body;

    if(!email || !password){
       return  next(new AppError('please provide email and passowrd',400));
    }

    const user = await User.findOne({email}).select('+password');

    // lets match user and password
    if(!user || !(await user.correctPassword(password,user.password))){
        return next(new AppError('incorrect email or password',401));
    }

    // 3) if everything is ok send token to client 
    const token = signToken(user._id);
    
    res.status(200).json({
        status:'success',
        token
        
    })

});



// protecting getalltours route

exports.protect = catchAsync( async (req, res, next)=>{
    // 1) getting token and check if its there

    let token;

    // jwt mein token header bhejnay ka standard tareeka hota hai 
    // header mein authorization ayega aur uski value mein start mein Bearer 
    // ab usko check krnay k liye 
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        // Bearer hsjahjashj bearer k bad wali value ko get krnay k liye 
        token = req.headers.authorization.split(' ')[1];
    }

    // agr token na mile tou
    if(!token){
        return next(new AppError('You are not logged in please log in to access',401))
    }
    // 2) verification of the token 

    // jwt khud hi verify krleta hai jwt.verify k zariye
    // ye 1 promise return krta hai is liye promisify
    const decode = await promisify(jwt.verify)(token , process.env.JWT_SECRET);
    // console.log(decode);


    // 3) check if user still exists 
    // yani kbhi token bnaya ho uske bad us user ko delete hojaye tou token bhi khatm hojana chaiye
    const currentUser = await User.findById(decode.id);
    if (!currentUser){
        return next(new AppError('the user belonging to this token does not exist', 401));
    }


    // 4) check if user changed password after the token was issued 
    // jb bhi token bnta hai iat yani issued at assigned hojata hai
   if( currentUser.changedPasswordAfter(decode.iat)){
    return next(new AppError('user change passoword please log in again',401));
   }
    

    // lets put entire user data on request(for future)
    req.user = currentUser;
    next();
});



//yahan permission denay ka function bnao

// middle ware mein parameter nahi de saktay is liye 1 function bnaye gay then us mein middleware function bnayegay 

exports.restrictTo = (...roles) =>{
    // yahan ab middleware function bnayegay us mein hum roles access kr saktay hn
    return (req, res , next) =>{
        // uper req.user mein pura user object hai wahan se role nikal jayega login user ka
        // roles is an array ['admin','lead-guide']
        if(!roles.includes(req.user.role)){
            return next(new AppError('You dont have permission to access this route',403))
        }

        next();
    }
}