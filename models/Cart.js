// user items totalPrice 

const mongoose=require('mongoose');
const User=require('../models/User')
const Product=require('../models/Product')
const cartSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
        unique:true
    },
    items:[{
        product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product",
        required:true
        },
        quantity:{
            type:Number,
            required:true,
            trim:true
        },
        price:{
            type:Number,
            required:true,
            trim:true
        }
    }],
    totalPrice:{
        type:Number,
        required:true,
        default:0
    }
},
{
    timestamps:true
}

)

module.exports=mongoose.model('Cart',cartSchema)