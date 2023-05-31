const User = require('../model/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');
const multer = require('multer')

// lets create a storage for multer
const multerStorage = multer.diskStorage({
  // req req hi hai file jo file ayegi cb is call back function
  destination:(req,file,cb)=>{
    // null agr error na ho tou baki path k image kahan save hogi
    cb(null,'public/img/users')
  },
  filename:(req,file,cb)=>{
    // lets extract extension of file
    // mimetype se extension mil jayegi
    const ext = file.mimetype.split('/')[1];
    cb(null,`user-${req.user.id}-${Date.now()}.${ext}`);
  }
    
});

// lets make a filter k sirf image hi upload hon
const multerFilter = (req,file,cb)=>{
  if(file.mimetype.startsWith('image')){
    // yani koi error nahi
    cb(null,true)
  }else{
    // error hai cb mein error jayega
    cb(new AppError('Not an image please upload a image',400),false)
  }
}

// here use multer 

const upload = multer({
  storage:multerStorage,
  fileFilter:multerFilter
})


// jo photo  upload.single('photo') ka middleware function bna

exports.uploadUserPhoto =  upload.single('photo');



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
    // console.log(req.file)
    if(req.body.password || req.body.passwordConfirm){
      return next(new AppError('This is not the route for passwords update.plz use /updateMyPassword'))
    } 

    // 2) update user documents 
    // filter unwanted fields name
    const filteredBody = filterObj(req.body , 'name' , 'email');
    // saving images to our database 
    if(req.file) filteredBody.photo = req.body.filename;
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



  