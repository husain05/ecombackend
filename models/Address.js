const mongoose=require('mongoose')
const User=require('../models/User')
const addressSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User"
    },
    fullName:{
        type:String,
        required:true,
        trim:true
    },
    phone:{
        type:Number,
        required:true,
        trim:true,
        minlength:[10,"Phone number must be of exact 10 digits"],
        maxlength:[10,"Phone number must be of exact 10 digits"]    
    },
    addressLine:{
        type:String,
        required:true,
        trim:true
    },
    city:{
        type:String,
        required:true,
        trim:true,
    },
    state:{
        type:String,
        required:true,
        trim:true,
    },
    postalCode:{
        type:String,
        required:true
    },
    isDefault:{
        type:Boolean,
        default:false,
    }
})

module.exports=mongoose.model('Address',addressSchema)