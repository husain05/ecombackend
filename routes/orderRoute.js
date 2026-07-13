const express=require('express')
const router=express.Router()

const {createOrder,getAllOrders,getSingleOrder,updateOrderStatus,cancelOrder}=require('../controllers/orderController')
const { authentication,isAdmin } = require('../middleware/auth')

router.post('/create/order',authentication,createOrder);
router.get('/all/orders',authentication,getAllOrders);
router.get('/single/order/:orderId',authentication,getSingleOrder)
router.patch('/update/order-status/:orderId',authentication,isAdmin,updateOrderStatus)
router.patch('/cancel/order/:orderId',authentication,cancelOrder)


module.exports=router