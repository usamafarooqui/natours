const mongoose =require('mongoose');
const dotenv = require('dotenv')
dotenv.config({path:'./config.env'})
// uncaught exception 


// process.on('uncaughtException',err =>{
//   console.log(err.name , err.message);
//   process.exit();
  
// });

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



const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App is running on port ${port}...`);
});


// to handle unhandled routes

process.on('unhandledRejection',err =>{
  console.log(err.name , err.message);
  // jb esa error ajaye tou application ko shut down krdo
  // pehlaay server close kro
  server.close(()=>{
    process.exit();

  })
});


