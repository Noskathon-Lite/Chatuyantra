const express=require('express');   
const authController=require('../controllers/authController');
const auth=require('../controllers/authController');
const { identifier } =require('../middlewares/identification');
const router=express.Router();

router.post('/signup',authController.signup);
router.post('/login',authController.signin);
router.get('/logout',identifier, authController.logout);

// OTP validation
router.patch('/send-otp', authController.sendVerificationCode);
router.patch('/verify-otp',authController.verifyVerificationCode);

module.exports=router;