const mongoose =require('mongoose');

// parent referencing Tours and Users parents hn 
// reviews ko pta hoga tour aur user ka magr in dono ko reviews ka nahi pta hoga this is parent referencing

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
    // referencing here of Tour and User
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
    // virtual propertes ko on krengay q k wo bad mein kaam ayegi
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
}
);

const Review = mongoose.model('Review',reviewSchema);

modules.exports = Review;