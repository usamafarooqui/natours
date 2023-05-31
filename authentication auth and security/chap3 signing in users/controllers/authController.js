const User = require('../model/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
// for jsonwebtoken
const jwt = require('jsonwebtoken'); // npm i jsonwebtoken



// lets make a function for assigning token

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
    // pehli parameter payload hoga jo mongodb id hoga
    // DUSRA PARAMETER HUMARI SECRET KEY HOGI JO TOKEN KO ENCRYPT KREGI
    // 3 parameter expire kb hoga ye btayega
    // const token = jwt.sign({id:newUser._id},process.env.JWT_SECRET,{
    //     expiresIn:process.env.JWT_EXPIRES_IN
    // });

    // jo new user create hua hai uski id nikal li newUser._id
    const token = signToken(newUser._id);

    res.status(201).json({
        status:'success',
        // ab jo token create kia hai wo user ko send krengay
        token,
        data:{
            user: newUser
        }
    })
});


// to login user

exports.login= catchAsync(async(req,res,next)=>{
    const {email,password}=req.body;

    // 1) if email and password exists 
    if(!email || !password){
       return  next(new AppError('please provide email and passowrd',400));
    }

    // 2) check if users exists and password is correct 
    // .select('+password'); is isliye kia hai q k model mein passowrd visiblity off krdi hai aur yahan passeord
    // match kranay k liye isko unselect krna prega uske liye .select('+password');
    // user ko uski id se dhoonda hai
    const user = await User.findOne({email}).select('+password');

    // lets match user and password ye password match krnay k liye go to user mOdel
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