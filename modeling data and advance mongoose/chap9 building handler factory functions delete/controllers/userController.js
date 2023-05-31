const User = require('../model/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');




exports.getAllUsers= catchAsync(async ( req , res , next) =>{

  const users = await User.find();


    res.status(200).json({
      status:'success',
      results:users.length,
      data:{
        users
      }
    })
  });
  
  exports.createUser= ( req , res) =>{
    res.status(500).json({
      status:'error',
      message:'this route is not yet define'
    })
  }
  
  exports.getUser = ( req , res) =>{
    res.status(500).json({
      status:'error',
      message:'this route is not yet define'
    })
  }
  
  // for admin
  exports.updateUser= ( req , res) =>{
    res.status(500).json({
      status:'error',
      message:'this route is not yet define'
    })
  }

  // for users 
  // filter method 
  const filterObj =(obj , ...allowedFields)=>{
    const newObj = {};
    Object.keys(obj).forEach(el =>{
      if (allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
  }

  exports.updateMe = catchAsync(async(req, res , next)=>{
    //1) send errors if user post password data
    if(req.body.password || req.body.passwordConfirm){
      return next(new AppError('This is not the route for passwords update.plz use /updateMyPassword'))
    } 

    // 2) update user documents 
    // filter unwanted fields name
    const filteredBody = filterObj(req.body , 'name' , 'email');
    const updatedUser = await User.findByIdAndUpdate(req.user.id , filteredBody , {
      new:true,
      runValidators:true
    })

    res.status(200).json({
      status:'success',
      data:{
        user:updatedUser
      }
    })
  });
  // delete by user 

  exports.deleteMe= catchAsync(async(req,res,next)=>{
    await User.findByIdAndUpdate(req.user.id,{active:false});
    res.status(204).json({
      status:'success',
      data:null
    })
  })
  exports.deleteUser = factory.deleteOne(Review);



  // 