const { response, request } = require('express');
const Product = require('../models/Product');
const Review = require('../models/Review')

// create review controller

exports.createReview=async(request,response)=>{
    try{
        // get user id from request.user object
        const userId=request.user.id
        // fetch data from request body
        const {productId}=request.params;
        const {rating,comment}=request.body

        // check product exists or not
        const isProductPresent=await Product.findById(productId)
        if(!isProductPresent){
            return response.status(400).json({
                success:false,
                message:`Product not found with the specific product id`
            })
        }


        // check whether user already reviewed or not ... Review Collection me check kro particular product pe particular user ne rataing review kara hai ya nhi agar userid or product id present hui kisi bhi document me means user ne review,rating dedi
        const alreadyReviewed=await Review.findOne({
            user:userId,
            product:productId
        })

        // if user already gave rating and review then return response
        if(alreadyReviewed){
            return response.status(200).json({
                success:false,
                message:`User already Reviewed this product`
            })
        }

        // if not reviewd 
        const createReview=await Review.create({user:userId,product:productId,rating:rating,comment:comment});
        // now return successfull response
        return response.status(200).json({
            success:true,
            message:`Review created successfully`,
            data:createReview
        })
    }
    catch(error){
        console.log(error);
        return response.status(500).json({
            success:false,
            error:error.message,
            message:`Something went wrong while creating review`
        })
    }
}


// get all product reviews on the basis of product id

exports.getAllReviews=async(request,response)=>{
    try{
        const {productId}=request.params; // kisi ek product ke ke saare reviews leke ao
        // fetch all products reviews 
        const allReviews=await Review.find({product:productId}).populate('user', 'firstName lastName')

        // agar reviews empty hai particular product petoh response return krdo
        if(!allReviews || allReviews.length===0){
            return response.status(400).json({
                success:false,
                message:`Reviews not found on a particular product`
            })
        }

        // agar reviews hain product pe toh return krdo response
        return response.status(200).json({
            succes:true,
            message:`All reviews fetched sucessfully `,
            data:allReviews
        })



    }
    catch(error){
        console.log(error);
        return response.status(500).json({
            success:false,
            error:error.message,
            message:`Something went wrong while fetching all reviews of a particular product`
        })
    }
}


//update review 
exports.updateReview=async(request,response)=>{
    try{
         const {productId}=request.params 
         const userId=request.user.id
         // check whether review present with a particular productid and userId
         const isReviewPresent=await Review.findOne({
            user:userId,
            product:productId
         })

         if(!isReviewPresent){
            return response.status(400).json({
                success:false,
                message:`Review not found with the particular product id and userID`
            })
         }

         // if review present
         Object.assign(isReviewPresent,request.body); // jo bhi data aa raha hai body se update ke liye use isReviewPresent wale object me assign krdo bs whi fields jo update ke liye ayi hain baaki uy bhi krskte hain ke data fetch krlo or ceck krlo agar data bosy se undefined nhi aaa rha toh update krdo wrna wahi data rhne do jo phle se save hai eg if(rating!==undefined) {isReviewPresent.rating =rating}

         await isReviewPresent.save();

         //return response
         return response.status(200).json({
            success:true,
            message:`Review updated successfully`,
            data:isReviewPresent
         })

    }
    catch(error){
        console.log(error);
           return response.status(500).json({
            success:false,
            error:error.message,
            message:`Something went wrong while updating review`
        })
    }
}


//delete review
 
exports.deleteReview=async(request,response)=>{
    try{
         const {productId}=request.params;
         const userId=request.user.id
            
         const isReviewPresent=await Review.findOne({
            user:userId,
            product:productId
         })
                
         // if review is not present return response
         if(!isReviewPresent || isReviewPresent.length===0){
            return response.status(400).json({
                sucess:false,
                message:`Review not found with a particular product id and user id `
            })
         } 

         // if review found 

         await isReviewPresent.deleteOne()
        
         // return response for successfully deleted review
         return response.status(200).json({
            success:true,
            message:`Review deleted successfully`
         })

    }catch(error){
        console.log(error);      
            return response.status(500).jso({
                success:false,
                error:error.message,
                message:`Something went wrong while deleting product`
            })
        
    }
}