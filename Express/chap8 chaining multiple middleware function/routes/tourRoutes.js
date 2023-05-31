const express = require('express');
const tourController = require('../controllers/tourController')
const router = express.Router();



router.param('id' , tourController.checkId)

// create a checkbody middleware (route controller mein bnaya hai)
// check if body contains name and price property
// if not send back 400 status code
// Add it to the post handler stack


//                                                     yahan middleware dalo
router.route('/').get(tourController.getAllTours).post(tourController.checkBody , tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);




module.exports = router;