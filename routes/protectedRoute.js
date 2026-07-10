const express=require('express')
const router=express.Router()

const{auth}=require('../middleware/auth');

router.get('/me',auth,(request,response)=>{
    response.json({
       success:true,
       user:request.user
    })
})

module.exports=router;