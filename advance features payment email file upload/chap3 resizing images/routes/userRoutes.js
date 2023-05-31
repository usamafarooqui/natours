const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
// multer ko require kro
// const multer = require('multer');



const router = express.Router();

// here use multer 
// destination k yahan file save hogi
// const upload = multer({dest:'public/img/users'})



// create a route for signup

router.post('/signup' , authController.signup);
// login route 
router.post('/login' , authController.login);
router.get('/logout' , authController.logout);
// forgot password
router.post('/forgotPassword' , authController.forgotPassword);
// reset password
router.patch('/resetPassword/:token' , authController.resetPassword);



// sab routes mein protection lagani hai tou sab mein 1 1 kr k krnay k bjaye router pe hi lagado
// protects all routes after this middleware
router.use(authController.protect); 


// update password
router.patch('/updateMyPassword' , authController.updatePassword);

// update data
// yahan multer ko as a middleware use kro
// photo form k ander us field ka naam hai jo ye photo hold kregi
// now to go user controller updateme
router.patch('/updateMe',userController.uploadUserPhoto,userController.resizeUserPhoto, userController.updateMe);

// delete data by user 
router.delete('/deleteMe',  userController.deleteMe);

// me endpoint
router.get('/me',userController.getMe,userController.getUser);

// yahan bhi router wala middleware istemal krna prega 
router.use(authController.restrictTo('admin'))
router.route('/').get(userController.getAllUsers).post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);


module.exports = router;