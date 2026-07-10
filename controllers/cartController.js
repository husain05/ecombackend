const { request } = require('express');
const Cart=require('../models/Cart')
const Product=require('../models/Product')
exports.addToCart=async(request,response)=>{
   try{
     // fetch the userId from the query 
    const {userId}=request.user;
    const {productId,quantity}=request.body

    // check whether the product available in the product collection or not
    const isProductPresent=await Product.findById(productId)
    if(!isProductPresent){
        return response.status(400).json({
            success:false,
            message:`Product not found`
        })
    }
    // check the quantity whether quantity is less than stock or greater than
    if(quantity>isProductPresent.stock){
        return response.status(400).json({
            succes:false,
            message:`Insuffiecient stock`
        })
    }
    //find cart
    // mongo db me cart collection ke ander 100's of users present honge isliye phle cart fetch krke lao jo user login hai

    const userCart=await Cart.findOne({user:userId})
    // if user cart is not present 
    if(!userCart){
         // create cart 
         userCart=await Cart.create({user:userId, items:[],totalPrice:0})
    }
    // if cart present then check product exists or not if product exits 
    const existingProduct=await userCart.items.find((item)=>{ // items ek array hai usme bht saare products honge toh hr product pe jao or check kro ke jo items ke array me jo object hain unki product id kya frontend se anae wali productid ke equal hai ya nhi
       return item.product.toString()===productId // tostring will convert objectId into string
    })

    // ab agar existingProduct hai toh usme bs quantity increase krdo
    if(existingProduct){
        existingProduct.quantity=existingProduct.quantity+quantity
    }
    // if not existing product then add the product in cart 
    else{
        userCart.items.push({product:productId,quantity:quantity,price:isProductPresent.price})
    }
    // totalPrice
    userCart.totalPrice=userCart.items.reduce((total,item)=>{
        return total + item.price *item.quantity
    },0)
    await userCart.save()
    return response.status(200).json({
        success:true,
        message:`Product added to cart successfully`,
        data:userCart
    })

   }
   catch(error){
    console.log(error)
    return response.status(500).json({
        success:false,
        message:`Something went wrong while adding product to cart`
    })
   }
}

//getUserCart
exports.getUserCart =async(request,response)=>{
    try{
        const {userId}=request.user;
        // check whether cart exists with specific userid or not 
        const cartExists=await Cart.findOne(userId).populate('items.product','title description price stock images')
        if(!cartExists){
            return response.status(400).json({
                success:false,
                message:`cart does not found`,
            })
        }

        // if user found return successfull response
        return response.status(200).json({
            success:true,
            message:`User cart fetched successfully`,
            data:cartExists
            
        })

    }
    catch(error){
        console.log(error)
            return response.status(500).json({
                success:false,
                error:error.message,
                message:`Something went wrong while fetching User cart`
            })
        
    }
}

//updateQuantity
exports.updateQuantity=async(request,response)=>{
    try{
        // get userId from request.user
         const {userId}=request.user;
        //fetch productId from request.params
        const {productId}=request.params;
        //fetch quantity from request.body
       const {quantity}=request.body;

       // jo quantity body se aa rhi hai kya wh less than 1 toh nhi hai
       if(quantity<1){
        return response.status(400).json({
            success:false,
            message:`Quantity must be greater than 0`
        })
       }
       // check whether user cart is present in cart collection or not 
       const cartExists=await Cart.findOne(userId)
       // if cart is not present return response
       if(!cartExists){
        return response.status(400).json({
            success:false,
            message:`Cart does not found with the specific user id`
        })
       }
        // if cart is present then find product is present in the cart or not whom we are updating the quantity of product
        const isProductPresent=cartExists.items.find((item)=>{
            return item.product.toString()===productId; // means product present hai
        })

        // if product is not present
        if(!isProductPresent){
            return response.status(400).json({
                success:false,
                message:`Product is not present`
            })
        }

        // product present hai id match hogyi then first check the stock of the product is greater than the quantity 
        const product=await Product.findById(productId)
        // check stock 
        if(quantity>product.stock){
            return response.status(400).json({
                success:false,
                message:`Insuffiecient Stock`
            })
        }
        // if stock is suffiecient then update the quantity 
        isProductPresent.quantity= quantity
        // now totalPrice will also differ when quantity gets Updated
           cartExists.totalPrice = cartExists.items.reduce((total,item)=>{
                return total + item.price * item.quantity;
            },
            0
        );
        await cartExists.save()

        // now return response
        return response.status(200).json({
            success:true,
            message:`Quantity of a product updated successfully`,
            data:cartExists
        })

    }
    catch(error){
        console.log(error);
        return response.status.json({
            success:false,
            message:`Something went wrong while updating the quantity of a product`
        })
    }
}

// remove product from cart
exports.removeProductFromCart=async(request,response)=>{
    try{
        // fetch userid from request.user object
        const {userId}=request.user;
        const {productId}=request.params
        // check whether usercart exists with specific user id in cart collection
        const cartExists =await Cart.findById(userId)
        if(!cartExists){
            return response.status(400).json({
                success:false,
                message:`Cart not found with the specific user id `
            })
        }

        // if cartExists then check product exists or not in cart and if present then use filter method to remove product, filter method check all the item and whose id will be matched it remove and viceversa
        const product = cartExists.items.find((item=>{
            return item.product.toString()===productId;
        }))
        if(!product){
            return response.status(400).json({
                success:false,
                message:`Product not found`
            })
        }

        // if product found then 
        const removeProduct=cartExists.items.filter((item)=>{
            return item.product.toString()!==productId // filter method check all the item and whose id will be matched it removes eh product or viceversa
        })

        // now update the totalPrice
        cartExists.totalPrice=cartExists.items.reduce((total,item)=>{
            return totalPrice+(item.price*item.quantity)
        },o)

        await cartExists.save();
        // send successfull response
        return response.status(200).json({
            success:true,
            message:`Product removed successfully`,
            data:cartExists
        })
    }
    catch(error){
        console.log(error)
        return response.status(500).json({
            success:false,
            error:error.message,
            message:`Something went wrong while removing product from cart`
        })
    }
    
}
// clear cart 
exports.clearCart=async(request,response)=>{
    try{
         const {userId}=request.user;
         //check whether user cart exists in db cart collection 
         const cartExists=await Cart.findById(userId);
         // if not cart exists then return response
         if(!cartExists){
            return response.status(400).json({
                success:false,
                message:`Cart not found with specific user id`
            })
         }

         // if cart present 
         // clear cart
         cartExists.items=[]
         cartExists.totalPrice=0;
         await cartExists.save();

        // send successful response
        return response.status(200).json({
            success:true,
            message:`Cart cleared successfully`,
            data:cartExists
        })
    }
    catch(error){
        console.log(error)
        return response.status(500).json({
            success:false,
            error:error.message,
            message:`Something went while clearing cart`
        })
    }
}




