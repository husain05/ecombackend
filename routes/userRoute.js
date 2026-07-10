const express=require('express')
const router=express.Router()

const {signUp,logIn}=require('../controllers/userController')
const { refreshTokenController } = require("../controllers/refreshController");


router.post('/signup',signUp)
router.post('/login',logIn)
router.post('/refresh-token',refreshTokenController)

module.exports=router;


