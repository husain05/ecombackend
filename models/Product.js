const mongoose=require('mongoose')
const User=require('../models/User')
const productSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true,
    },
    description:{
        type:String,
        required:true,
        trim:true,
    },
    price:{
        type:Number,
        required:true,
        trim:true
    },
    stock:{
        type:Number,
        required:true,
        min:0,
        default:0
    },
    images:[{
        type:String,
        required:true,
        trim:true
    }],
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,

    }
}
,
{
    timestamps:true
}
)

module.exports=mongoose.model('Product',productSchema)