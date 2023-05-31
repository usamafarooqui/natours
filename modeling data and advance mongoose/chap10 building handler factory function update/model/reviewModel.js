const mongoose =require('mongoose');


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



const Review = mongoose.model('Review',reviewSchema);

module.exports = Review;