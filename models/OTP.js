const mongoose=require('mongoose')
const {mailSender}=require('../utils/sendEmail')
const otpTemplate=require('../templates/otpTemplate')

const otpSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        trim:true,

    },
    otp:{
        type:String,
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now,
        expires:5*60
    }
})





otpSchema.pre('save', async function() {
 try{
    await mailSender(
        this.email, // mongodb document ko save krne se phle doc bana deta hai or usi doc ko yh this refer krta hai
        `OTP Verification`,
        otpTemplate(this.otp)

    )
    
 }
 catch(error){
    console.log(error)
 }
});



module.exports=mongoose.model('OTP',otpSchema)