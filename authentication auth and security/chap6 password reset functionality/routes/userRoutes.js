const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');


const router = express.Router();

// create a route for signup

router.post('/signup' , authController.signup);
// login route 
router.post('/login' , authController.login);
// forgot password
router.post('/forgotPassword' , authController.forgotPassword);
// reset password
router.post('/reset' , authController.resetPassword);



router.route('/').get(userController.getAllUsers).post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);


module.exports = router;