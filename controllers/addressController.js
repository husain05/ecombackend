const { request } = require('express')
const Address=require('../models/Address')

exports.addAddress=async(request,response)=>{
    try{
        const userId=request.user.id
        const {fullName,phone,addressLine,city,state,postalCode,isDefault}=request.body;
        if(!fullName || !phone || !addressLine || !city || !state || !postalCode){
            return response.status(400).json({
                success:false,
                message:`All fields are required`
            })
        }

        // if new address is present and user click to " Make this my default address" so set isdefault true in new address and set is default false in old address
        if(isDefault){ // if admin click on button " Make this my default address" so jitne bhi isDefault true the unko false krdo
            await Address.updateMany({user:userId},{isDefault:false})
        }

        // now save address in db
        const saveAddess=await Address.create({user:userId,fullName,phone,addressLine,city,state,postalCode,isDefault})
        return response.status(200).json({
            success:true,
            message:`Address saved successfully`,
            data:saveAddess
        })
    }
    catch(error){
        console.log(error);
        return response.json({
            success:false,
            error:error.message,
            message:`Something went wrong while adding address`
        })
        
    }
}

// getAllAddress
exports.getAllAddress=async(request,response)=>{
    try{
        const userId=request.user.id
        const allAddress=await Address.find({user:userId})
        if(!allAddress || allAddress.length===0){
            return response.status(400).json({
                success:false,
                message:`Address not found`
            })
        }

        // if all address fetched successfully
        return response.status(200).json({
            success:true,
            message:`All address fetched successfully`,
            data:allAddress
        })
    }
    catch(error){
        console.log(error);
        return response.status(500).json({
            success:false,
            error:error.message,
            message:`Something went wrong while fetching address`,
        })
    }
}


// updateAddress
exports.updateAddress=async(request,response)=>{
    try{
        const {id}=request.params;
        const userId=request.user.id
        // check whether address is present or not
        const isAddressPresent=await Adderess.findOne({ // as Address colecion has multiple users addresses so we have to find the address with the specific userId and addressid  
            _id:id,
            user:userId
        })
        if(!isAddressPresent){
            return response.status(400).json({
                success:false,
                message:`Address not present with the specific userid and address id`
            })
        }

        // we are not fetching data from request body suppose we fetched data from request body so object.assign(isaddressPresent,user:userId,fullName,phone,addressLine,city,state,postalCode,isDefault) if user wants to change only city field so other fields will be marked as undefined
        // Jo address document findOne() se mila hai, usme req.body me jo fields aayi hain sirf unhi ko update (overwrite) kar do. Baaki fields ko waise hi rehne do
            Object.assign(isAddressPresent,request.body)   
        // agar request.body me isDeafut aya hai 
            if(request.body.isDefault){
                await Address.updateMany({
                    user:userId,
                    isDefault:false
                })

             isAddressPresent.isDefault=true
            }

            await isAddressPresent.save();
        
            return response.status(200).json({
                success:true,
                message:`Address updated successfully`
            })
 
    }
    catch(error){
          console.log(error);
          return response.status(500).json({
          success:false,
          error:error.message,
          message:`Something went wrong while updating address`,
        })
    }
}


// delete Address
exports.deleteAddress=async(request,response)=>{
    try{
        const {id}=request.params;
        const userId=request.user.id

        // check whether addresss exists in address collection with the particular userId or not
        const isAddressPresent=await Address.findOne({_id:id,user:userId})
        if(!isAddressPresent){
            return response.status(400).json({
                success:false,
                message:`Address not found with the specific user id`
            })
        }
        //if address found 
       await isAddressPresent.deleteOne()
       return response.status(200).json({
        success:true,
        message:`Address deleted successfully`
       })
    }
    catch(error){
      console.log(error);
      return response.status(500).json({
        success:false,
        error:error.message,
        message:`Something went wrong while deleting address`
      })
    }
}