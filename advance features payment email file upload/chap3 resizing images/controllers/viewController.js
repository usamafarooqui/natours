const Tour = require('./../model/tourModel');
const User = require('./../model/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError')


exports.getOverview = catchAsync( async (req,res, next)=>{
    // get our data from the collection 
    const tours = await Tour.find();
    res.status(200).render('overview',{
      title:'All the tours',
      tours
      
    });
  });

  exports.getTour = catchAsync(async(req,res)=>{
    // get data from the requested tour (including reviews and guides)
    const tour = await Tour.findOne({slug:req.params.slug}).populate({
      path:'reviews',
      fields:'review rating user'
    })
    // if no tour is found 
    if(!tour){
      next(new AppError('there is no tour with that name',404))
    }
    res.status(200).render('tour',{
      tour:`${tour.name} Tour`,
      tour
     
    });
  })

  exports.getLoginForm = ( req,res)=>{
    res.status(200).render('login',{
      title:'log into your account'
    })
  }


  // get account details

  exports.getAccount = ( req,res)=>{
    res.status(200).render('Account',{
      title:' your account'
    })
  }

  exports.updateUserData = catchAsync(async(req,res,next)=>{
    const updatedUser = await User.findByIdAndUpdate(req.user.id,{
      name:req.body.name,
      email:req.body.email
    },{
      new:true,
      runValidators:true
    });

    // yahan page ko updated info do
    res.status(200).render('Account',{
      title:' your account',
      user:updatedUser
    })
  });