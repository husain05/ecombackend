const express=require('express')
const router=express.Router()


const {createReview,getAllReviews,updateReview,deleteReview}=require('../controllers/reviewControlller')
const { authentication } = require('../middleware/auth')

router.post('/create/review/:productId',authentication,createReview)
router.get('/all/reviews/:productId',authentication,getAllReviews)
router.put('/update/review/:productId',authentication,updateReview)
router.delete('/delete/review/:productId',authentication,deleteReview)


module.exports=router;