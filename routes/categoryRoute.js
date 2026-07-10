const express=require('express');
const router=express.Router();

const {authentication,isAdmin}=require('../middleware/auth')

// now get handlers from controller

const{createCategory,getAllCategory,getSingleCategory,updateCategory,deleteCategory}=require('../controllers/categoryController')

router.post('/create/category',authentication,isAdmin,createCategory)
router.get('/all/caegories',authentication,isAdmin,createCategory)
router.get('single/category/:categoryId',authentication,isAdmin,createCategory)
router.put('/update/category/:categoryId',authentication,isAdmin,createCategory)
router.delete('/delete/category/:categoryId',authentication,isAdmin,createCategory)

module.exports=router