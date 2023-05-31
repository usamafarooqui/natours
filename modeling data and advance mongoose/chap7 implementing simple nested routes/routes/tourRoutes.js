const express = require('express');
const tourController = require('../controllers/tourController');
const authController = require('./../controllers/authController');
const reviewController = require('./../controllers/reviewController');
const router = express.Router();

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getTourStat);

router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

// lets protect get all routes
router
  .route('/')
  .get(authController.protect, tourController.getAllTours)
  .post(tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour
  ); // to give permission to login admin only uske bad model mein ja k admin ki field bnao


  
// real world mein reviews esay nahi bntay
// jesay postman mein bna dia

// reviews esay bnay gay l specific tour hoga iski specific id hogi aur uska review hoga aur jo user login hoga uski id hogi
// post/tour/dnjdsjn1298328/reviews
// get/tour/dnjdsjn1298328/reviews
// get/tour/dnjdsjn1298328/reviews/ 2732h2h22kj2 for a specific tour

router
  .route('/:tourId/reviews')
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.createReview
  );

module.exports = router;
