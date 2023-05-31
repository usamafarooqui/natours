const Review = require('./../model/reviewModel');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');



// create a review 
// if body se data araha ho wala kaam yahan nahi kr sakatay iska alag middleware bnana prega 
exports.setTourUserIds = (req,res,next)=>{
     // if body se data na araha ho
     if(!req.body.tour) req.body.tour=req.params.tourId;
     if(!req.body.user) req.body.user=req.user.id;
     next();
}


// exports.createReview= catchAsync( async(req,res,next)=>{
//     // if body se data na araha ho
//     if(!req.body.tour) req.body.tour=req.params.tourId;
//     if(!req.body.user) req.body.user=req.user.id;
//     const newReview = await Review.create(req.body);

//     res.status(200).json({
//         status:'success',
//         data:{
//             review:newReview
//         }
//     })
// });



// get all reviews 

exports.getAllReviews= factory.getAll(Review);


// delete a review

exports.deleteReview = factory.deleteOne(Review);

// update a review 

exports.updateReview = factory.updateOne(Review);

// create a review 
exports.createReview = factory.createOne(Review);

// get a review 

exports.getReview = factory.getOne(Review);