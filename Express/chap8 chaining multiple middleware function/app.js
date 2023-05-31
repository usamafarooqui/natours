const express = require('express');
const userRouter = require('./routes/userRoutes')
const tourRouter = require('./routes/tourRoutes')
const morgan = require('morgan');

const app = express();

app.use(morgan('dev'));
app.use(express.json());

app.use((req, res, next) => {
  console.log('hello from middleware');
  next();
});



app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// how to make sepreate routes mounting multiple routes
// apni main api ko middleware mein dalo
// ye humesha router create krnay k neechay hi ayega
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users' , userRouter);


module.exports =app;



