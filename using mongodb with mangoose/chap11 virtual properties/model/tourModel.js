const mongoose =require('mongoose');


const tourSchema = new mongoose.Schema({
  
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
      default:Date.now(),
      select:false
    },
    startDates:[Date]
  },{
    // yahan btana prega k api mein virtual property bhi show ho 
    toJSON:{virtuals:true}, // json mein bhi ye property show hogi and 
    toObject:{virtuals:true} // jb json ko object bnaigay jb bhi
  }
  
  );

  // lets make a virtual fields
  // get is liye k ye virtual property jb bhi data database se get hoga create hogi
  // virtual property ko query mein use nahi kr saktay
  // durationweeks humne apni virtual property ka naam rakha hai
  tourSchema.virtual('durationWeeks').get(function () {
    // this keyword will be pointing to the current document 
    return this.duration/7;
  })




  const Tour = mongoose.model('Tour', tourSchema);

  module.exports = Tour;
