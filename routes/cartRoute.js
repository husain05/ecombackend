const express=require('express')
const router=express.Router()

const {addToCart,getUserCart,updateQuantity,clearCart,removeProductFromCart} =require('../controllers/cartController');
const { authentication } = require('../middleware/auth');
router.post('/add/cart',authentication,addToCart)
router.get('/get/cart',authentication,getUserCart)
router.patch('/update/quantity/:productId',authentication,updateQuantity)
router.delete('/remove-product/cart/:productId',authentication,removeProductFromCart)
router.delete('/clear/cart',authentication,clearCart)

module.exports=router;
