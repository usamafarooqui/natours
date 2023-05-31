const mongoose =require('mongoose');

const slugify = require('slugify');


const tourSchema = new mongoose.Schema({
  
    name:{
      type:String,
      required:[true, 'A tour must have a name'],
      unique:true
    },
    slug:String,
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
    startDates:[Date],
    secretTour:{
      type:Boolean,
      default:false
    }
  },{
 
    toJSON:{virtuals:true},  
    toObject:{virtuals:true} 
  }
  
  );


 
  // document middleware 
  // pre means run before create and save but not on insert many or findbyid or findbyidandupdate
  // 'save' ye wo event hai jahan ye middleware run hoga it is also called pre save hook
  // middleware hai is liye next dena prega
  tourSchema.pre('save',function(next){
    // this indicates the currently process document (the document being save)
    // slug is just a string that we can put in our url usually based on the string like the name
    this.slug = slugify(this.name , {lower:true});
    next();
  })


  // post document middleware
  // post mein this ki jaga doc hota hai jo save hua va document dikhata hai
  // tourSchema.post('save',function(doc , next){
  //   console.log(doc);
  //   next();
  // })



  // query middleware it runs before or after a certain query
  // query middleware mein find hota hai 
  // aur iska this document ki jaga query ko indicate krta hai 
  // lets make screte tour which are not shown to the public
  // /^find/ ye regular expression hai jo sare find walay mein ko select kr k un pe lagay ga
  tourSchema.pre(/^find/,function(next){
    // yahan this pe query k sare function lag saktay hn
    this.find({secretTour:{$ne:true}});
    // to calculate time of pre and post find middleware
    // this is a regular object so we can set any property on it
    this.start = Date.now();
    next();
  });


  // post query middleware
  // secret tour ko find se hide krdega 
  tourSchema.post('/^find/',function(docs,next){
    this.find({secretTour:{$ne:true}});
    console.log(`the query too ${Date.now() - this.start} milliseconds`);
    
    next();
  });

  // aggregation middleware run on aggregation before or after
  // secret tour ko aggregate se bhi hide krna hai
  tourSchema.pre('aggregate',function(next){
    // to remove secret tour 
    // pipeline bhi array hai array k starting mein kuch dalnay k liye unshift use hota hai
    // match 1 stage hai jo humne start mein dal dia hai takay wo secrettours k ilawa baki sab ko pipeline mein jane de
    // this is going to point the current aggrete object
    this.pipeline().unshift({$match:{secretTour:{$ne:true}}})
    console.log(this.pipeline()); // is se sare aggregate functions show hojayengay
    next();
  })





  const Tour = mongoose.model('Tour', tourSchema);

  module.exports = Tour;
