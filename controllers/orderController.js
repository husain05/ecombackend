const Product=require('../models/Product')
const Order=require('../models/Order')
const Address = require('../models/Address')
const Cart=require('../models/Cart')
const { response } = require('express')


exports.createOrder=async(request,response)=>{
    try{
            // fetch user id fom request.user object for checking whether user exists or not 
            const userId=request.user.id
            // addressId and paymentMethod come from request.body 

            const {addressId,paymentMethod}=request.body

            // check whether cartExists or not because when we login then we have to add product first in a cart then we can order the product
            const cartExits=await Cart.findOne({user:userId}).populate('items.product')
            // if cart not exists or cartExists.length===0 then return response
            if(!cartExits || cartExits.length===0){
                return response.status(400).json({
                    success:false,
                    message:`Cart is empty`
                })
            }

            // if cartExists 
            // then check address 

            const address=await Address.findOne({_id:addressId,user:userId});
            if(!address){
                return response.status(400).json({
                    success:false,
                    message:`Address not found with the specific userId`
                })
            }
            
            // check product stock and quantity of a product
            for(let item of cartExits.items ){
                if(item.quantity>item.product.stock){
                    return response.status(400).json({
                        success:false,
                        message:`${item.product.title} is out of stock`
                    })
                }
            }

            // if stock is present means quantity is less than the stock
            for (let item of cartExits.items){
                // product find kro 
                const product=await Product.findByIdAndUpdate(
                    item.product._id,

                    {
                        $inc:{ // inc operator is used to increement and decrement the number 
                            stock:item.quantity
                        }

                    }
                )
                
            }


            // create Order

            const order=await Order.create({
                user:userId,
                items:cartExits.items,
                shippingAddress:addressId,
                paymentMethod:paymentMethod,
                totalAmount:cartExist.totalPrice
            })
        

            // order created 
            // cart empty krdo

            cartExits.items=[]
            cartExists.totalPrice=0;

          await cartExits.save()
            

          // now return successful response
          return response.status(200).json({
            success:true,
            message:`Order placed successfully`
          })

    }
    catch(error){
        console.log(error);
        return response.status(500).json({
            success:false,
            error:error.message,
            message:`Something went wrong while creating order`
        })
    }
}

// get all orders
exports.getAllOrders=async(request,response)=>{
    try{
        const userId=request.user.id
        const allOrders=await Order.find(userId).populate('items.product','title description price images').populate('shippingAddress').sort({createdAt:-1}) // latest orders leke ao

        // now return response 
        return response.status(200).json({
            success:true,
            message:`All orders fetched successfully`,
            count:allOrders.length,
            data:allOrders
        })
    }
    catch(error){
        console.log(error);
        return response.status(500).json({
            success:false,
            error:error.message,
            message:`Something went wrong while fetching all orders`
        })
    }
}


// get single order
exports.getSingleOrder=async(request,response)=>{
    try{
         const userId=request.user.id
         const orderId=request.params;
        
         const singleOrder=await Order.findOne({_id:orderId,user:userId}).populate('items.product').populate('shippingAddress')

         // if order not present return response
         if(!singleOrder){
            return response.status(400).json({
                success:false,
                message:`Order not found with the specific orderId and userId`
            })
         }


         // if order found return successfull response
         return response.status(200).json({
            success:true,
            messag:`Order fetched succesfully`,
            data:singleOrder
         })
    }
    catch(error){
        console.log(error);
        return response.status(500).json({
            success:false,
            error:error.message,
            message:`Something went wrong while fetching single`
        })
    }
}

// Update Order status
exports.updateOrderStatus=async(request,response)=>{ 
    try{
        // fetch orderId from request.params and order status from request.body
        const {orderId}=request.params;
        const {orderStatus}=request.body
        // check whether order exists
        const orderExists=await Order.findById(orderId);// yh seller ki end se ho raha hai maanlo admin login hai user id ayi admin ki ab admin ko order delete krna hai toh findone(user:userId,orderId) ab order id toh user ki hai or userId loogedin user ki hai jo ke admin hai ab orderid 101 husian ki hai but wh user hai or login admin hai findOne check krega kya 101 or userId true ordercollection me hai means order husain ka or logged in Admin hai isliye wh status update nhi hoga
        if(!orderExists){
            return response.status(400).json({
                success:false,
                message:`Order not found with the particular id `
            })
        }

        // if order found then update the orderStatus
        orderExists.orderStatus=orderStatus
        await orderExists.sve()

        // return successful response
        return response.status(200).json({
            success:true,
            message:`Order status updated sucessfully`,
            data:orderExists
        })

    }
    catch(error){
        return response.status(500).json({
            success:false,
            error:error.messag,
            message:`Something went wrong while updating order status`
        })
    }
}

// cancel order
exports.cancelOrder=async(request,response)=>{
    try{
         const {orderId}=request.params 
         const userId=request.user.id

         const orderExists=await Order.findOne({_id:orderId,user:userId})// yaha pe agar userlogged in hai toh whi sirf apna order cancel kr skta hai eg orderid=o101 and created by user=u101 now if another user logged in nad have my user id so output will be null bcz only logged in user can delete their order 

         //check whether order exists or not
         if(!orderExists){
            return response.status(400).json({
                succesS:false,
                message:`Order does not exists with the specific orderId and userId`
            })
         }

         // if order exists 
         // check the orderstatus whether it is in pending mode or approval mode 
         if(orderExists.orderStatus==='Pending'){
            return response.status(400).json({
                success:false,
                message:`Your order cannot be cancelled because it is in pending mode`
            })
         }

         // if it is not in pending state 
        //  then restore stock back 
        for(let item of orderExists.items){
            await Product.findByIdAndUpdate(
                item.product._id,
                {
                    $inc:{
                        stock:item.quantity
                    }
                })
        }

        // now cancel order 
        orderExists.orderStatus='Cancelled'

        // now return successfull response
        return response.status(200).json({
            success:true,
            message:`Order cancelled successfully`,
            data:orderExists
        })
        
            
    }
    catch(error){
        console.log(error)
        return response.status(500).json({
            success:false,
            error:error.message,
            message:`Something went wrong while cancelling the order`
        })
    }
}