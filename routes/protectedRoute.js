const express=require('express')
const router=express.Router()

const{authentication}=require('../middleware/auth');

router.get('/me',authentication,(request,response)=>{
    response.json({
       success:true,
       user:request.user
    })
})

module.exports=router;