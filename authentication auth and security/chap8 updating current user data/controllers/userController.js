const User = require('../model/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');


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
  // ...allowedFields ye array bna dega jb function mein parameter mein sari values dalaingay object k bad
  const filterObj =(obj , ...allowedFields)=>{
    const newObj = {};
    // eassy way to loop through a object in js it will retrun an array of field name 
    // then hum us pe loop chala dengay
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
    // save method nahi chalay ga yehan pe q k wo validators chalaye ga like password dalo
    // filetr kr rahay hn post data ko req.body se sirf naa, aur email include hongay
    const filteredBody = filterObj(req.body , 'name' , 'email');
    const updatedUser = await User.findByIdAndUpdate(req.user.id , filteredBody , {
      new:true, // return new updated object
      runValidators:true
    })

    res.status(200).json({
      status:'success',
      data:{
        user:updatedUser
      }
    })
  });
  
  exports.deleteUser = ( req , res) =>{
    res.status(500).json({
      status:'error',
      message:'this route is not yet define'
    })
  }



  // 