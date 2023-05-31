const express = require('express');
const userRouter = require('./routes/userRoutes')
const tourRouter = require('./routes/tourRoutes')
const morgan = require('morgan');

const app = express();

app.use(morgan('dev'));
app.use(express.json());

// to serve static files 
// jb search krengay tou public nahi likhaingay
app.use(express.static(`${__dirname}/public`))

app.use((req, res, next) => {
  console.log('hello from middleware');
  next();
});



app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});


app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users' , userRouter);


module.exports =app;



