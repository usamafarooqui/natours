const express = require('express');
const userRouter = require('./routes/userRoutes')
const tourRouter = require('./routes/tourRoutes');
const globalErrorHandler = require('./controllers/errorController')
const AppError = require('./utils/appError');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const app = express();
// global middlewares 

const limiter = rateLimit({
  max:100, // max request per api
  windowMs:60*60*1000, // 1 hour 
  message:'to many request from this ip please try again later in an hour'
});

 
app.use(morgan('dev'));
app.use(express.json());

// to serve static files 
app.use(express.static(`${__dirname}/public`))


app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(req.headers);
  next();
});


app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users' , userRouter);



app.all('*',(req, res , next)=>{
  next(`cant find ${req.originalUrl} on this server!!!`,404);
});


// make a global error handling middleware 
// agr app.use mein ye 4 parameter dal dogay tou wo automatically error handling middleware bn jayega 
app.use(globalErrorHandler);


module.exports =app;



