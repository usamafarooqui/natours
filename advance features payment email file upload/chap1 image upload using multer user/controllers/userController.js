const User = require('../model/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');




exports.getAllUsers= factory.getAll(User);
  exports.createUser= factory.createOne(User);
  
  exports.getUser = factory.getOne(User);
  
  // for admin (donot update password with this)
  exports.updateUser= factory.updateOne(User);

  // for users 
  // filter method 
  const filterObj =(obj , ...allowedFields)=>{
    const newObj = {};
    Object.keys(obj).forEach(el =>{
      if (allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
  }

  // how to retrive data from current logged in user 

  exports.getMe = (req,res,next)=>{
    req.params.id = req.user.id;
    next();
  }

  exports.updateMe = catchAsync(async(req, res , next)=>{
    //1) send errors if user post password data
    // file dekho yahan se 
    console.log(req.file)
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


  // delete user
  exports.deleteUser = factory.deleteOne(User);



  