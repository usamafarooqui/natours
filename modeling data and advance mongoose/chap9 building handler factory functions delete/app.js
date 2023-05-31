const express = require('express');
const userRouter = require('./routes/userRoutes')
const tourRouter = require('./routes/tourRoutes');
const globalErrorHandler = require('./controllers/errorController')
const AppError = require('./utils/appError');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
// call router 
const reviewRouter = require('./routes/reviewRoutes')



const app = express();
// global middlewares 

// securing http headers
app.use(helmet());

// limit request from same api
const limiter = rateLimit({
  max:100, // max request
  windowMs:60*60*1000, // 1 hour 
  message:'to many request from this ip please try again later in an hour'
});

app.use('/api', limiter);
app.use(morgan('dev'));
// reading data from the body req.body
// we can also limit body 
app.use(express.json({limit:'10kb'}));
// data sanitization against nosql query injection
app.use(mongoSanitize());
// data sanitization against malicious html
app.use(xss());
// prevent parameter pollution
// whitelist se wo sare duplicate ho saken gay
app.use(hpp({
  whitelist:['duration','ratingsQuantity','ratingsAverage','difficulty','price','maxGroupSize']
}));




// to serve static files 
app.use(express.static(`${__dirname}/public`))

// test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.headers);
  next();
});


app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users' , userRouter);
app.use('/api/v1/reviews' , reviewRouter);



app.all('*',(req, res , next)=>{
  next(`cant find ${req.originalUrl} on this server!!!`,404);
});


// make a global error handling middleware 
// agr app.use mein ye 4 parameter dal dogay tou wo automatically error handling middleware bn jayega 
app.use(globalErrorHandler);


module.exports =app;



