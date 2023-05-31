const express = require('express');
const tourController = require('../controllers/tourController')
const router = express.Router();


// tourRouter.route('/').get(getAllTours).post(createTour);

// tourRouter
//   .route('/:id')
//   .get(getTour)
//   .patch(updateTour)
//   .delete(deleteTour);


// tourRoutes ko change kr k router kro for standard

  

// 1) 
// param middleware
// "id" bta raha hai k kis ko target krna hai val mein value store hogi param ki
// jb bhi id ki query chalay ye middleware chalay ga
router.param('id' , tourController.checkId)

router.route('/').get(tourController.getAllTours).post(tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);


// is router ko export krdo

module.exports = router;