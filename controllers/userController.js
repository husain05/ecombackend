
const User=require('../models/User')
const bcrypt=require('bcrypt')
const {generateToken}=require('../utils/generateToken')
const {generateRefreshToken}=require('../utils/generateToken')
// signup api 
exports.signUp=async(request,response)=>{
    try{

        
        // fetch data from request.body
        const {firstName,lastName,userName,email,password,phone}=request.body;
        if(!firstName || !lastName || !userName || !email || !password || !phone){
            return response.status(400).json({
                success:false,
                message:`All fields are required`,
            })
        }
        // check whether email ends with @gmail.com or not
        if(!email.endsWith('@gmail.com')){
            return response.status(400).json({
                success:false,
                message:`email must ends with @gmail.com`
            })
        }
        // check length of phone number 
        if((phone.length<10)||(phone.length>10))
        {
             return response.status(400).json({
                success:false,
                message:`Phone number must be of exact 10 digits`
            })
        }
        //check whether user exits or not
        // we can check user through phone number, username and email ??
        const userExists=await User.findOne({email:email});
        if(userExists){
            return response.status(400).json({
                success:false,
                message:`User is already registered`
            })
        }
        // now hash the password
        let hashedPassword;
        try{
            console.time('hash')
            hashedPassword=await bcrypt.hash(password,10);
            console.log(hashedPassword)
            console.timeEnd('hash')
        }

        catch(error){
            console.log(error);
            return response.status(400).json({
                success:false,
                message:`Something went wrong while hashing password`,
                error:error.message
            })
        }
        // now save user data in database 
        const saveUser=await User.create({firstName,lastName,userName,email,password:hashedPassword,phone});
        saveUser.refreshToken=undefined
        return response.status(200).json({
            success:true,
            message:`User created Successfully`,
            data:saveUser,
        })
        
    }
    catch(error){
        return response.status(500).json({
            success:false,
            error:error.message,
            message:`Something went wrong while signup`
        })
    }
} 

// login controller
exports.logIn=async(request,response)=>{
    try{
        const {email,password}=request.body;
        if(!email || !password){
            return response.status(400).json({
                success:false,
                message:`All fields are required`
            })
        }
        // check user exists or not
        // check user by phone number, username and email
        const userExists=await User.findOne({email});
        if(!userExists){
            return response.status(400).json({
                success:false,
                message:`User is not registered, please signup first`
            })
        }
        // users can login through phone number and username also but for now just login through email
        // if user already present 
        // compare password 
      const isPasswordCorrect=await bcrypt.compare(password,userExists.password);
      if(!isPasswordCorrect){
        return response.status(401).json({
            success:false,
            message:`Incorrect Credentials`
        })
      }
         
      // if password is correct .... create token 
      const payload={
        id:userExists._id,
        email:userExists.email,
      }

      // call generateToken function from utils 
      const accessToken = generateToken(payload)
      // call generateRefreshToken function
      const refreshToken = generateRefreshToken(payload)
      
      // save refresh token
      userExists.refreshToken=refreshToken;
      await userExists.save(); // we have refreshToken field in User Schema 

    //   send refresh token cookie response 
      response.cookie('refreshToken',refreshToken,{
        httpOnly:true,
        maxAge:7*24*60*60*1000
     })
      
     // now return json with successful code
    return  response.status(200).json({
        success:true,
        data:{
           id:userExists._id,
           username:userExists.userName,
           email: userExists.email,
           role:userExists.role
        },
        accessToken:accessToken,
     })

    }
    catch(error){
        return response.status(500).json({
            success:false,
            error:error.message,
            message:`Something went wrong while login`
        })
    }
}



// logout controller 
exports.logout=async(request,response)=>{
    try{
         const {userId}=request.params;
         const userExists=await User.findById(userId);
        //  check user exists or not 
         if(!userExists){
            return response.status(400).json({
                success:false,
                message:`User does not exists with this specific user id`
            })
         }
        // if present
        userExists.refreshToken=null;
        await userExists.save();

        response.clearCookie('refreshToken',{
            httpOnly:true
        })

        return response.status(200).json({
            success:true,
            message:`Logout Successfull`
        })

    }
    catch(error){
        console.log(error);
        return response.status(500).json({
            success:false,
            message:`Something went wrong while logout`
        })
    }
}