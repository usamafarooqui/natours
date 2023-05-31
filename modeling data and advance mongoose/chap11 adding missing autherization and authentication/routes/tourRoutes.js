const express = require('express');
const tourController = require('../controllers/tourController');
const authController = require('./../controllers/authController');
const reviewController = require('./../controllers/reviewController');
const router = express.Router();
// import the review router
const reviewRouter = require('./../routes/reviewRoutes');

// real world mein reviews esay nahi bntay
// jesay postman mein bna dia

// reviews esay bnay gay l specific tour hoga iski specific id hogi aur uska review hoga aur jo user login hoga uski id hogi
// post/tour/dnjdsjn1298328/reviews
// get/tour/dnjdsjn1298328/reviews
// get/tour/dnjdsjn1298328/reviews/ 2732h2h22kj2 for a specific tour

// router
//   .route('/:tourId/reviews')
//   .post(
//     authController.protect,
//     authController.restrictTo('user'),
//     reviewController.createReview
//   );

// jb bhi esa path hoga ye  review router handle krega
// magr is mein tourId ki value nahi jayegi is k liye review router mein ja k mergeParams:true
router.use('/:tourId/reviews', reviewRouter);

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getTourStat);

router
  .route('/monthly-plan/:year')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide', 'guide'),
    tourController.getMonthlyPlan
  );

// lets protect get all routes
router
  .route('/')
  .get(tourController.getAllTours)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.createTour
  );

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.updateTour
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour
  ); // to give permission to login admin only uske bad model mein ja k admin ki field bnao

module.exports = router;
