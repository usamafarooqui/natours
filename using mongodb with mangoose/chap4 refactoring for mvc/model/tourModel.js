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
    rating:{
      type:Number,
      default:4.5
    }, 
    price:{
      type:Number,
      price:[true, 'A tour must have a price']
    }
  });
  
  // lets make a model
  
  const Tour = mongoose.model('Tour', tourSchema);


  // export the model

  module.exports = Tour;

  // go to tourController