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

// to handle unhandle routes 
// all se get post put delete sab ajaingay
app.all('*',(req, res , next)=>{
  res.status(404).json({
    status:'fail',
    // ye jo url send ki user ne thi wo hai
    message:`cant find ${req.originalUrl} on this server!!!`
  })
})


module.exports =app;



