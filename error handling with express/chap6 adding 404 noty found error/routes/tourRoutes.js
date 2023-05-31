const express = require('express');
const tourController = require('../controllers/tourController')
const router = express.Router();


// aliasing make a route for most search path 
//                                ye middleware hai iske ander logic lagay ga
router.route('/top-5-cheap').get(tourController.aliasTopTours ,tourController.getAllTours);

// pipeline wala route
router.route('/tour-stats').get(tourController.getTourStat);

// business problem konsay month mein sab se ziada log tour select krtay hn
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);


router.route('/').get(tourController.getAllTours).post(tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);




module.exports = router;