const express = require('express');
const path = require('path');
const userRouter = require('./routes/userRoutes');
const tourRouter = require('./routes/tourRoutes');
const viewRouter = require('./routes/viewRoutes');
const globalErrorHandler = require('./controllers/errorController')
const AppError = require('./utils/appError');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
var cors = require('cors');
const cookieParser = require('cookie-parser')
// call router 
const reviewRouter = require('./routes/reviewRoutes')



const app = express();
app.use(cors())
// to use pug 
app.set('view engine','pug'); 
app.set('views',path.join(__dirname,'views'))
// global middlewares 
// to serve static files 
app.use(express.static(`${__dirname}/public`))


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
//take data from form
app.use(express.urlencoded({extended:true,limit:'10kb'}))
app.use(cookieParser());
// data sanitization against nosql query injection
app.use(mongoSanitize());
// data sanitization against malicious html
app.use(xss());
// prevent parameter pollution
// whitelist se wo sare duplicate ho saken gay
app.use(hpp({
  whitelist:['duration','ratingsQuantity','ratingsAverage','difficulty','price','maxGroupSize']
}));






// test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(req.cookies);
  next();
});

// send pug file to the browser


app.use('/', viewRouter);
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



