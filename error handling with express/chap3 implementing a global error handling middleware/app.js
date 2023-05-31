const express = require('express');
const userRouter = require('./routes/userRoutes')
const tourRouter = require('./routes/tourRoutes')
const morgan = require('morgan');

const app = express();

app.use(morgan('dev'));
app.use(express.json());

// to serve static files 
app.use(express.static(`${__dirname}/public`))


app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});


app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users' , userRouter);



app.all('*',(req, res , next)=>{
  // res.status(404).json({
  //   status:'fail',
  //   message:`cant find ${req.originalUrl} on this server!!!`
  // })
  const err = new Error(`cant find ${req.originalUrl} on this server!!!`)
  err.status = 'fail';
  err.statusCode=404;
  // agr next mein koi bhi argunment dal denagay tou it will assume it is a error 
  next(err)
});


// make a global error handling middleware 
// agr app.use mein ye 4 parameter dal dogay tou wo automatically error handling middleware bn jayega 
app.use((err, req, res, next)=>{
  // to know status code 
  // agr status code aya tou theek warna 500 bhej dega
  err.statusCode = err.statusCode || 500;
  // to know status 
  err.status = err.status || 'error';

  res.status(err.statusCode).json({
    status:err.status,
    message:err.message
  })
  
});


module.exports =app;



