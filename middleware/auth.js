const jwt =require('jsonwebtoken')
require('dotenv').config()
exports. authentication=(request,response,next)=>{
    try{
        console.log("Auth middleware reached");
        // now fetch token from where it is saved during login
         const accessToken = request.cookies?.accessToken ||request.header("Authorization")?.replace("Bearer ", "");       
         console.log("token from cookie :",request.cookies?.accessToken)
        console.log("token from header :",request.header("Authorization"));

        // if token is expires or the value of token is not present
        if(!accessToken){
            return response.status(400).json({
                success:false,
                message:"token not found"
            })
        }
        
        
        // if token found then decode the token
        const decode = jwt.verify(accessToken,process.env.JWT_SECRET)
        console.log(jwt.decode(accessToken));

        request.user=decode // for authorization

        next();

    }
    catch(error){
        return response.status(500).json({
            success:false,
            error:error.message,
            message:"Token is invalid "
        })
    }
}

exports.isAdmin=(request,response,next)=>{
   try{                      
     if(request.user.role!=='Admin'){
        return response.status(400).json({
            success:false,
            message:`This is the protected route for admin`
        })
    }
    next()
   }
   catch(error){
    console.log(error)
    return response.status(500).json({
        error:error.message,
        success:false,
        message:`Something went wrong while verifying the role`
    })
   }
}