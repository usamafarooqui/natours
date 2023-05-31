const mongoose =require('mongoose');
const dotenv = require('dotenv')
dotenv.config({path:'./config.env'})
const app = require('./app');

// CONNECT MONGODB
const DB = process.env.DATABASE;
mongoose.connect(DB,{
  useNewUrlParser:true,
  useUnifiedTopology: true,
  useCreateIndex:true,
  useFindAndModify:false
}).then(()=> {
    console.log('conncection successful')
});

// lets make a schema model k liye schema must hota hai

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

// lets save data through the model

const testTour = new Tour({
  name:'the forest hiker',
  rating:4.7,
  price:497
})

// to save the document
testTour.save().then(doc=>{
  console.log(doc)
}).catch(err => {
  console.log(err)
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App is running on port ${port}...`);
});