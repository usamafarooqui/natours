const catchAsync = require("../utils/catchAsync");
const AppError = require('./../utils/appError');
const ApiFeatures = require('../utils/apiFeatures');


// delete function 
exports.deleteOne = Model =>catchAsync(async (req, res , next) => {
  
    const doc =  await Model.findByIdAndDelete(req.params.id);
     
     if(!doc){
       return next(new AppError('No document found with that id',404) );
     }
     res.status(204).json({
       status: 'success',
       data: {
         tour: null,
       },
     });
   
 });


// update function 

exports.updateOne = Model => catchAsync(async (req, res , next) => {
 
  const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  
  if(!doc){
    return next(new AppError('No document found with that id',404) );
  }
  res.status(200).json({
    status: 'success',
    data: {
      data:doc
    },
  });

});


// create function

exports.createOne = Model => catchAsync(async (req, res, next) => {
  const doc = await Model.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      data: doc
    }
  });

});


// get one function 

exports.getOne = (Model , popOptions) => catchAsync(async (req, res , next) => {
  
  // populate ki waja se humain thori changes krni prengi                                             
  // const doc = await Model.findById(req.params.id).populate('reviews');
  // yahan 404 ka error bnagay k in case id galat ho

  let query = Model.findById(req.params.id);
  if(popOptions) query=query.populate(popOptions);
  const doc = await query;

  if(!doc){
    return next(new AppError('No document found with that id',404) );
  }
  console.log(doc.status);
  res.status(200).json({
    status: 'success',
    data: {
      data:doc
    }
  });


});

// get all function 

exports.getAll = Model => catchAsync(async (req, res , next) => {
  // to allow for nested get reviews on tour
  let filter = {};
  if(req.params.tourId) filter ={tour:req.params.tourId};
 
  const features = new ApiFeatures(Model.find(filter), req.query)
    .filter()
    .limitFields()
    .paginate()
    .sort();
  const doc = await features.query;
  res.status(200).json({
    status: 'success',
    results: doc.length,
    data: {
      data:doc
    },
  });

});

