const mongoose=require('mongoose');
const User=require('../models/User');
const Address = require('./Address');
const orderSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
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

      shippingAddress:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Address",
        required:true,
       },

      paymentMethod:{
        type:String,
        enum:['COD','ONLINE'],
        default:'COD'
       },


      paymentStatus: {
        type: String,
        enum: ["Pending", "Paid", "Failed"],
        default: "Pending"
        },

      orderStatus: {
        type: String,
        enum: [
            "Pending",
            "Confirmed",
            "Shipped",
            "Delivered",
            "Cancelled"
        ],
        default: "Pending"
        },

      totalAmount: {
        type: Number,
        required: true
    }
     
},
{
    timestamps:true,
}


)

module.exports=mongoose.model('Order',orderSchema)