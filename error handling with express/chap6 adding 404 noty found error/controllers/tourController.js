const Tour = require('../model/tourModel');
const ApiFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingAverage,price';
  req.query.fields = 'name,price,ratingAverage,summary,difficulty';
  next();
};



exports.getAllTours = catchAsync(async (req, res , next) => {
 
    const features = new ApiFeatures(Tour.find(), req.query)
      .filter()
      .limitFields()
      .paginate()
      .sort();
    const tours = await features.query;
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours,
      },
    });
  
});

exports.getTour =  catchAsync(async (req, res , next) => {
  
    const tour = await Tour.findById(req.params.id);
    // yahan 404 ka error bnagay k in case id galat ho
    // in javascript null means false

    if(!tour){
      // return lagana zaroori hai takay function foran return hojaye aur next line pe na jaye
      return next(new AppError('No tour found with that id',404) );
    }
    console.log(tour.status);
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  
  
});

exports.createTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      tour: newTour,
    },
  });

});

exports.updateTour =  catchAsync(async (req, res , next) => {
 
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    
    if(!tour){
      return next(new AppError('No tour found with that id',404) );
    }
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
 
});

exports.deleteTour =  catchAsync(async (req, res , next) => {
  
   const tour =  await Tour.findByIdAndDelete(req.params.id);
    
    if(!tour){
      return next(new AppError('No tour found with that id',404) );
    }
    res.status(204).json({
      status: 'success',
      data: {
        tour: null,
      },
    });
  
});

// aggregate  pipleine controller here

exports.getTourStat = catchAsync(async (req, res, next) => {
 
    // array k ander sare wo methods hongay jo humain implement krnay hn
    // Tour humara model hai aur aggregate function
    const stats = await Tour.aggregate([
      {
        // match is to select or filter certain objects this is primary stage to prpare for the next stage
        $match: { ratingAverage: { $gte: 4.5 } },
      },
      {
        // allows to group documents together using accumalotors(to calculate airthematic logics)
        $group: {
          // id se group by krtay hn agr id null hogi tou sab 1 group mein hongay
          // _id:null,
          // agr kisi aur field se group krna hai tou
          // _id:'$difficulty',
          // to convert this in uppercase
          _id: { $toUpper: '$difficulty' },
          // _id:'$ratingAverage',
          // avgRating is a new field $avg is a mongodb operator is to calculate average $ratingAverage k iska average calculate krna hai
          numTours: { $sum: 1 },
          numRatings: { $sum: '$ratingQuantity' },
          avgRating: { $avg: '$ratingAverage' },
          avgPrice: { $avg: '$price' },
          maxPrice: { $max: '$price' },
          minPrice: { $min: '$price' },
        },
      },
      {
        // 1 yani assceding
        // avgPrice use krna hai instead of price q k pipeline mein ab uske variables available hongay
        $sort: { avgPrice: 1 },
      },
      //    {
      //   // Id mein ab difficulty save hai aur ne yani not equal wo fileds dega jiski difficulty easy nahi hai
      //   $match:{ _id:{$ne:'EASY'}}
      // }
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        stats,
      },
    });

    // routes mein ja k tour route mein iska route bnao
   
});

// fix business logic k konsay month mein sab se ziada tour hotay hn

exports.getMonthlyPlan = catchAsync(async (req, res , next) => {
 
    const year = req.params.year * 1;
    const plan = await Tour.aggregate([
      {
        // deconstruct array fields from input documents and output 1 document from each of the array
        $unwind: '$startDates',
      },
      {
        // bus 1 saal k tour nikalnay k liye
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`), // jan-01-2021 se bara
            $lte: new Date(`${year}-12-31`), // dec-31-2022 se chota se bara
          },
        },
      },
      {
        $group: {
          // $month date mein se month extract krlega khud
          _id: { $month: '$startDates' },
          // how to count tours in months
          numTourStarts: { $sum: 1 },
          // 1 array bna dega push aur $name is mein jo tour us month mein huay hn unke naam dal dega
          tours: { $push: '$name' },
        },
      },
      {
        // month ki field add krega
        $addFields: { month: '$_id' },
      },
      {
        $project: {
          // id 0 yani id kp remove krdega
          _id: 0,
        },
      },
      {
        // month ko highest tour k hisab se sort krengay
        // -1 yani descending
        $sort: { numTourStarts: -1 },
      },
      {
        // k kitnay result show hongay only for reference
        $limit: 12,
      },
    ]);

    res.status(200).json({
      status: 'success',
      size: plan.length,
      data: {
        plan,
      },
    });
   
});
