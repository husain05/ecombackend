const {generateToken}=require('../utils/generateToken')
require('dotenv').config()
exports.refreshTokenController=async(request,response)=>{
    try{
      const refreshToken=request.cookies.refreshToken
      console.log(request.cookies.token)
     

    const decoded = jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET
    );

    //payload me jo id pdi hai wh decode kri hai
    const user = await User.findById(decoded.id);

    if (user.refreshToken !== refreshToken) { // means refresh token ame nhi hai cookie or db wala 
    return response.status(401).json({
        message: "Invalid refresh token"
    });
  }

    // Naya access token
    const accessToken = generateToken({
    firstName:user.firstName,
    id: user._id,
    email: user.email,
    role:user.role
    });

     response.json({ accessToken });
    }
    catch(error){
        console.log(error)
        return response.status(500).json({
            success:false,
            error:error.message,
            message:`Something went wrong while verifying refresh token`
        })
    }
}

// means user logged in hua access token localstorage/memory pe save krta hai jiski validity 15 minutes hai ab user 15 min me private route hit krta hai authorization bearer me token aata hai jwt authorization bearer se token leta hai verify krta hai or next middleware pe chala jata hai or cart controller execute hota hai or cart page open hojata hai ab agar user 15 minutes baad /cart hit krta hai toh joh token localstorage/memory frontend pe save hota hai toh Frontend phir wahi Access Token Authorization header me bhejta hai.Middleware phir jwt.verify(accessToken, JWT_SECRET) karta hai.Is baar Access Token expire ho chuka hota hai, isliye jwt.verify() khud TokenExpiredError throw karta hai. Hume manually currentTime > exp check nahi karna padta. jwt khud payload me expire or issue field generate krdeta hai...Middleware 401 Unauthorized response bhej deta hai frontend ko. Frontend 401 dekhkar /refresh-token API call karta hai.Browser automatically httpOnly cookie me stored Refresh Token bhej deta hai.Backend Refresh Token verify karta hai, database se match karta hai aur agar sab valid ho to naya Access Token generate karke frontend ko bhej deta hai.Frontend purane Access Token ko replace krke new token save krta hai aur original /cart request dobara bhejta hai.Is baar Access Token valid hota hai, middleware next() call karta hai aur cartController execute ho jata hai.