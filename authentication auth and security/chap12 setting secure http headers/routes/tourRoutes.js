const express = require('express');
const tourController = require('../controllers/tourController');
const authController = require('./../controllers/authController');
const router = express.Router();



router.route('/top-5-cheap').get(tourController.aliasTopTours ,tourController.getAllTours);


router.route('/tour-stats').get(tourController.getTourStat);


router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

// lets protect get all routes
router.route('/').get(authController.protect,tourController.getAllTours).post(tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(authController.protect, authController.restrictTo('admin' , 'lead-guide'),tourController.deleteTour); // to give permission to login admin only uske bad model mein ja k admin ki field bnao




module.exports = router;