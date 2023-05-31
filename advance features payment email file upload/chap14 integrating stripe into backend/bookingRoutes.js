const express = require('express');
const bookingController = require('./bookingController');
const authController = require('./../controllers/authController');


// yahan rest principle follow nahi krengay bcz its not for creating deleting or updating 
// this route is only for client to get check out sessions 

Router.get('/checkout-session/:tourId',authController.protect , bookingController.getCheckOutSession)


module.exports = router;
