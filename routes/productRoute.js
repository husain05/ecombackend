const express=require('express');
const router=express.Router()

const {authentication,isAdmin}=require('../middleware/auth')
const {createProduct,getAllProducts,getSingleProduct,updateProduct,deleteProduct}=require('../controllers/productController')

router.post('/create/product',authentication,isAdmin,createProduct)
router.get('/all/products',authentication,isAdmin,getAllProducts)
router.get('/single/product/:productId',authentication,isAdmin,getSingleProduct)
router.put('/update/product/:productId',authentication,isAdmin,updateProduct)
router.delete('/delete/product/:productId',authentication,isAdmin,deleteProduct)

module.exports=router