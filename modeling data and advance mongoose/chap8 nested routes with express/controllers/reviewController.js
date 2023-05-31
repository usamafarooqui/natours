const Review = require('./../model/reviewModel');
const catchAsync = require('./../utils/catchAsync');


// get all reviews 

exports.getAllReviews= catchAsync( async(req,res,next)=>{
    // agr tourId bhi ho tou bus us tour k tamam reviews nikalaingay 
    let filter = {};
    if(req.params.tourId) filter ={tour:req.params.tourId};
    
    const reviews = await Review.find(filter);

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
    // if body se data na araha ho
    if(!req.body.tour) req.body.tour=req.params.tourId;
    if(!req.body.user) req.body.user=req.user.id;
    const newReview = await Review.create(req.body);

    res.status(200).json({
        status:'success',
        data:{
            review:newReview
        }
    })
});