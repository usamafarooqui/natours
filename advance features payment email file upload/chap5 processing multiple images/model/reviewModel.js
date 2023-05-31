const mongoose =require('mongoose');
// neechay jo rating calculate ki hai usko isko tour mein dalna hai 
const Tour = require('./tourModel');


const reviewSchema = new mongoose.Schema({
    review:{
        type:String,
        required:[true,'A review cannot be empty']
    },
    rating:{
        type:Number,
        min:1,
        max:5
    },
    createdAt:{
        type:Date,
        default: Date.now
    },
    tour:{
        type:mongoose.Schema.ObjectId,
        ref:'Tour',
        required:[true,'review must belong to a tour']
    },
     user:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:[true,'review must belong to a user']
    }
},
{
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
}
);

// preventing duplicate reviews by indexing
// tour , user mein 1 ya -1 daldo us se farq nahi parta but akhir k unique true se ye kaam krega
reviewSchema.index({tour:1,user:1},{unique:true})
// populate the fields by referencing 

reviewSchema.pre(/^find/,function(next){
    // populate krnay k liye this.populate and 2 field ko populate krna ho tou 2 dafa populate use krtay hn
    // this.populate({
    //     path:'tour',
    //     select:'name'
    // }).populate({
    //     path:'user',
    //     select:'name photo'
    // })

     this.populate({
        path:'user',
        select:'name photo'
    })
    
    next();
})

// we will use static method to calculate because this in static method indicate to current model
// schema name , static methid , function name
reviewSchema.statics.calcAverageRatings= async function(tourId){
    // we will use aggregated pipeline
    const stats = await this.aggregate([
        {
            $match:{tour:tourId}
        },
        {
            $group:{
                _id:'$tour',
                nRating:{$sum:1},
                avgRating:{$avg:'$rating' }
            }
        }
    ]);
    console.log(stats);
    if(stats.length > 0){
        await Tour.findByIdAndUpdate(tourId,{
            ratingsQuantity:stats[0].nRating,
            ratingsAverage:stats[0].avgRating
        })
    }else{
        await Tour.findByIdAndUpdate(tourId,{
            ratingsQuantity:0,
            ratingsAverage:4.5
        })
    }
};


reviewSchema.post('save',function(){
    // this points to the current document beign saved
    // constructor is liye lagaya hai q k review model pe call krna tha magr wo iske neechay hai usko uper krengay 
    // tou wo kaam nahi krega is liye constructor lagaya
    this.constructor.calcAverageRatings(this.tour);
   
})

// calculate revies while update and delete
// find works on query middleware not model 
reviewSchema.pre(/^findOneAnd/, async function(next){
    // this indicates the current query 
    // findOne query execute krega jo docyment return krega
    // r ko this.r krengay q k r ki value post mein chaiye hogi
    // this.r krnay se wo 1 document bn jayega jisko is function se bahr use kr saktay hn
    this.r = await this.findOne();
    console.log(this.r);
    next();
});

// 1 dafa query save hogai hai uper ab hum usko updated data k sath calculate kr saktay hn

reviewSchema.post(/^findOneAnd/, async function(){
    // await this.findOne(); doesnot work here query has already been executed
    // this.r as a model use kia hai
  await this.r.constructor.calcAverageRatings(this.r.tour);
   
});

const Review = mongoose.model('Review',reviewSchema);

module.exports = Review;