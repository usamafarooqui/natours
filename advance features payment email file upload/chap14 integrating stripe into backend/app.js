const express = require('express')
const bookingRouter = require('./bookingRoutes');
const authController = require('./../controllers/authController');


app.use('/api/v1/bookings' , bookingRouter);