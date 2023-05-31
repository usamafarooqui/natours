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


// geospatial query work here

exports.getToursWithin =catchAsync(async(req,res , next)=>{
  const {distance , latlng , unit} = req.params;
  const [lat , lng] = latlng.split(',');

  // yahan distance ko convert kro
  const radius = unit === 'mi'? distance/3963.2:distance/6378.1;

  if(!lat || !lng){
    next(new AppError('please provide the latitude and longitude in the format lat , lan',400))
  }

  // yahan filter object lagaingay
  // start location lengay q k us mein coordinates han hr tour k kahan se start hai
  // gerowithin mongo ka special operator hai jo area ko search krega
  // ye center sphere leta hai jis mein coordinates aur radius hota hai
  // distance ko esy nahi de saktay ye radian mein value leta hai is le isko convert krna parega
  // jis field mein geospatial data hai usko index bhi krna prega yahan start location
  const tours = await Tour.find({startLocation:{$geoWithin:{$centerSphere:[[lng,lat],radius]}}});

 res.status(200).json({
  status:'success',
  results:tours.length,
  data:{
    data:tours
  }
 })
});


// geospatial aggregation
// calculte distance of each tour k humse kitna door hai 

exports.getDistances = catchAsync(async(req,res,next)=>{
  const {latlng , unit} = req.params;
  const [lat , lng] = latlng.split(',');

  const multiplier = unit ==='mi'? 0.000621371 : 0.001;


  if(!lat || !lng){
    next(new AppError('please provide the latitude and longitude in the format lat , lan',400))
  }

  const distances = await Tour.aggregate([
    {
      // geospatial aggregation mein bus 1 hi stage hota hai geoNear aur ye sab se pehla bhi hota hai
      // it takes 1 field as a geoSpatial index 
      // we did that start location
      // since we have only one field with geospatial index it automatically takes that
      // agr se ziada field hoti tou usko key value k through btana parta
      $geoNear:{
        // it is a mandotory fields ye near btaye ga k kahan se distance calculate krna hai
        near:{
          type:'Point',
          coordinates:[lng*1,lat*1]
        },
        // this is the name of the field that will be create where all the calculated distances will be stored
        distanceField:'distance',
         //  yahan distance ko meter se kilometer mein convert krengay 
         distanceMultiplier:multiplier
      }
    },
    {
       
      // aur aur response mein bus tour name and distance return krengay na k pura tour data
      // project se data select krengay
      $project:{
        distance:1,
        name:1
      }
    }
  ]);

  res.status(200).json({
    status:'success',
    results:distances.length,
    data:{
      data:distances
    }
   })

})