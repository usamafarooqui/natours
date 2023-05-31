const mongoose = require("mongoose");
const slugify = require("slugify");
// npm i validator
// const validator = require('validator');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A tour must have a name"],
      unique: true,
      trim:true,
      // data validation on string 
      maxlength:[40 ,'A tour name must have equal or less than 40 characters'],
      minlength:[10 ,'A tour name must have equal or more than 40 characters']
      // validator library se liya hua valiator 
      // validate:[validator.isAlpha , 'Tour name must only contain characters']
    },
    slug: String,
    duration: {
      type: Number,
      require: [true, "A tour must have a duration"],
    },
    maxGroupSize: {
      type: Number,
      require: [true, "A tour must have a group size"],
    },
    difficulty: {
      type: String,
      require: [true, "A tour must have a difficulty"],
      // to give only 3 values of difficulty
      enum:{
        values:['easy','medium','hard'],
        message:'difficulty is either easy medium or hard'
      }
    },
    ratingAverage: {
      type: Number,
      default: 4.5,
      // max min on numbers 
      max:[5,'Rating must be below 5.0'],
      min:[1,'Rating must be above 1.0'],
    },
    ratingQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      price: [true, "A tour must have a price"],
    },
    // priceDiscount: Number,
    // lets make a custom validator to check if discoount price is lower than actual price
    priceDiscount:{
      type:Number,
      // validate humne lagaya hai takay custom validator laga saken
      validate:{
        validator:function(val){
          // this only points to current doc and new document on creation doesnt work on update 
          return val < this.price;
        },
        message:" Discount Price ({VALUE)} should be below regular price"
      }
    },
    summary: {
      type: String,
      trim: true,
      required: [true, "A tour must have a description"],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, "A tour must have a cover image"],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

tourSchema.virtual("durationWeeks").get(function () {
  return this.duration / 7;
});

tourSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

tourSchema.pre("/^find/", function (next) {
  this.find({ secretTour: { $ne: true } });

  this.start = Date.now();
  next();
});

tourSchema.pre("/^find/", function (next) {
  this.find({ secretTour: { $ne: true } });

  next();
});

tourSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  console.log(this.pipeline()); 
  next();
});

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
