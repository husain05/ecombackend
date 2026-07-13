const express=require('express')
const router=express.Router()

const {signUp,logIn,logOut}=require('../controllers/userController')
const { refreshTokenController } = require("../controllers/refreshController");
const { authentication } = require('../middleware/auth');


router.post('/signup',signUp)
router.post('/login',logIn)
router.post('/logout',authentication,logOut)
router.post('/refresh-token',refreshTokenController)

module.exports=router;


