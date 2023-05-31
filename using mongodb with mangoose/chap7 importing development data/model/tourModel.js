const mongoose =require('mongoose');


const tourSchema = new mongoose.Schema({
    // name:String,
    // rating:Number,
    // price:Number
  
    name:{
      type:String,
      required:[true, 'A tour must have a name'],
      unique:true
    },
    duration:{
      type:Number,
      require:[true,'A tour must have a duration']
    },
    maxGroupSize:{
      type:Number,
      require:[true,'A tour must have a group size']
    },
    difficulty:{
      type:String,
      require:[true,'A tour must have a difficulty']
    },
    ratingAverage:{
      type:Number,
      default:4.5
    }, 
     ratingQuantity:{
      type:Number,
      default:0
    }, 
    price:{
      type:Number,
      price:[true, 'A tour must have a price']
    },
    priceDiscount:Number,
    summary:{
      type:String,
      trim:true,
      required:[true , 'A tour must have a description']
    },
     description:{
      type:String,
      trim:true,
    },
     imageCover:{
      type:String,
      required:[true , 'A tour must have a cover image']
    },
    images:[String],
    createdAt:{
      type:Date,
      default:Date.now()
    },
    startDates:[Date]
  });
  
  // lets make a model
  
  const Tour = mongoose.model('Tour', tourSchema);


  // export the model

  module.exports = Tour;

  // go to tourController