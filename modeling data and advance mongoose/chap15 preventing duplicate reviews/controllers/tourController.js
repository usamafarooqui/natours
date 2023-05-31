const Tour = require('../model/tourModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingAverage,price';
  req.query.fields = 'name,price,ratingAverage,summary,difficulty';
  next();
};



exports.getAllTours = factory.getAll(Tour);

exports.getTour =  factory.getOne(Tour, {path:'reviews'})

exports.createTour = factory.createOne(Tour);

exports.updateTour =  factory.updateOne(Tour);

exports.deleteTour = factory.deleteOne(Tour);



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
