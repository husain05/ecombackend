const OTP=require('../models/OTP');
console.log("OTP IS:",OTP)
const User = require('../models/User');
const otpGenerator=require('otp-generator')

exports.sendOTP=async(request,response)=>{
    try{
        const {email}=request.body;
        if(!email){
            return response.status(400).json({
                success:false,
                message:`Please fill the email field for OTP`
            })
        }

        // check whether user exists in db or not 
        const userExist=await User.findOne({email});
        if(userExist){
            return response.status(400).json({
                success:false,
                message:`User already exists`
            })
        }

        // if user not exists 
        // generate otp 

        let generateOTP= otpGenerator.generate(6,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false,
        })

        // check whether duplicate otp exists in db?

        let result=await OTP.findOne({otp:generateOTP})

        // if exists then genearte the unique otp
        while(result){ // jbtak duplicate otp mil raha hai tbtak new otp banate rho
            generateOTP=otpGenerator.generate(6,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false,
            })
            result=await OTP.findOne({otp:generateOTP}) // check krte rho unique otp generate hua ya nhi
        }


        // now if unique otp is generated then save the otp
        await OTP.create({email:email,otp:generateOTP})

        return response.status(200).json({
            success:true,
            message:`OTP sent successfully`
        })
    }
    catch(error){
        return response.status(500).json({
            success:false,
            error:error.message,
            message:`Something went wrong while sending otp`,
        })
    }
}