const mongoose=require('mongoose')
const userSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        trim:true
    },
    lastName:{
        type:String,
        required:true,
        trim:true,
    },
    userName:{
        type:String,
        required:true,
        maxlength:10,
        minlength:3,
        unique:true,
    },
    email:{
        type:String,
        required:true,
        trim:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
        trim:true,
    }, 
    phone:{
        type:Number,
        required:true,
        trim:true,
        unique:true,
        minlength:[10, "Phone Number must be of 10 digits"],
        maxlength:[10, "Phone Number must be of 10 digits"]
    },
    refreshToken: {
        type: String,
        default: null,
    },
    role: {
    type: String,
    enum: ["User", "Admin"],
    default: "User"
}  
}
,
{
    timestamps:true
}
) 

module.exports=mongoose.model('User',userSchema)