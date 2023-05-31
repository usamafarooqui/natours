const express = require('express');
const tourController = require('../controllers/tourController')
const router = express.Router();


// aliasing make a route for most search path 
//                                ye middleware hai iske ander logic lagay ga
router.route('/top-5-cheap').get(tourController.aliasTopTours ,tourController.getAllTours)


router.route('/').get(tourController.getAllTours).post(tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);




module.exports = router;