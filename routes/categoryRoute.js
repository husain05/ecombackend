const express=require('express');
const router=express.Router();

const {authentication,isAdmin}=require('../middleware/auth')

// now get handlers from controller

const{createCategory,getAllCategory,getSingleCategory,updateCategory,deleteCategory}=require('../controllers/categoryController')

router.post('/create/category',authentication,isAdmin,createCategory)
router.get('/all/categories',authentication,isAdmin,getAllCategory)
router.get('/single/category/:categoryId',authentication,getSingleCategory)
router.put('/update/category/:categoryId',authentication,isAdmin,updateCategory)
router.delete('/delete/category/:categoryId',authentication,isAdmin,deleteCategory)

module.exports=router