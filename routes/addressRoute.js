const express=require('express')
const router=express.Router()

const {addAddress,getAllAddress,updateAddress,deleteAddress}=require('../controllers/addressController');
const { authentication } = require('../middleware/auth');

router.post('/add/address',authentication,addAddress)
router.get('/all/address',authentication,getAllAddress)
router.put('/update/address/:id',authentication,updateAddress)
router.delete('/delete/address/:id',authentication,deleteAddress)
module.exports=router;