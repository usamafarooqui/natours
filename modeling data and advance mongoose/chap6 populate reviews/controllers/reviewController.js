const Review = require('./../model/reviewModel');
const catchAsync = require('./../utils/catchAsync');


// get all reviews 

exports.getAllReviews= catchAsync( async(req,res,next)=>{
    const reviews = await Review.find();

    res.status(200).json({
        status:'success',
        result:reviews.length,
        data:{
            reviews
        }
    })
});


// create a review 

exports.createReview= catchAsync( async(req,res,next)=>{
    const newReview = await Review.create(req.body);

    res.status(200).json({
        status:'success',
        data:{
            review:newReview
        }
    })
});