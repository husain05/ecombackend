const Product =require('../models/Product')
const Category=require('../models/Category')
const { request, response } = require('express')

exports.createProduct=async(request,response)=>{
    try{
         const {title,description,price,stock,images,category}=request.body
         if(!title||!description||!price||!stock===undefined||!images||!category){
            return response.status(400).json({
                success:false,
                message:`All fields are required`
            })
         }
         // check category exists or not through categoryid coming from body with the name category  
         const categoryExists =await Category.findById(category)
         if(!categoryExists){
            return response.status(400).json({
                success:false,
                message:`category not found`
            })
         }

         // if found then create entry in db 
         const saveProduct=await Product.create({title,description,price,stock,images,category})
         // send successfull response
         return response.status(200).json({
            success:true,
            message:`Product created successfully`,
            data:saveProduct
         })
    }
    catch(error){
        console.log(error)
        return response.status(500).json({
            success:false,
            error:error.message,
            message:`Something went wrong while creating product`
        })
    }
}


// get all product 
exports.getAllProducts=async(request,response)=>{
    try{
         const allProducts=await Product.find({}).populate('category','name slug').sort({createdAt:-1})
         // check products available or not 
         if( allProducts.length===0){
            return response.status(400).json({
                success:false,
                message:`Products are not available`
            })
         }
        return response.status(200).json({
            success:true,
            message:`All products fetched successully`,
            count:allProducts.length,
            data:allProducts
        })

    }
    catch(error){
        console.log(error)
        return response.status(500).json({
            success:false,
            message:`Something went wrong while fething all products`
        })
    }
}

// get single product through id 

exports.getSingleProduct=async(request,response)=>{
    try{
         // fetch id from request.params
         const {productId}=request.params;
         const productExists=await Product.findById(productId).populate('category','name slug');
         if(!productExists){
            return response.status(400).json({
                success:false,
                message:`Product does not exists`
            })
         }
         // if exists 
         return response.status(200).json({
            success:true,
            message:`Product fetched successfully`,
            data:productExists
         })
         

    }
    catch(error){
        console.log(error)
        return response.status(500).json({
            success:false,
            error:error.message,
            message:`Something went wrong while fetching the product`
        })
    }
}


// updateProduct
exports.updateProduct=async(request,response)=>{
    try{
        const {productId}=request.params;
        const {title,description,price,stock,images,category}=request.body
        // check whether product exists or not 
        const productExists=await Product.findById(productId).populate('category','name slug')
        if(!productExists){
            return response.status(400).json({
                success:false,
                message:`Product does not exists with the specific id`
            })
        } 
        //suppose admin ne request bheji c1 ki but c1 koi document hai hi nhi category collection me or product me category ka id reference hai if admin make request for update the product and if the category is not present with the particular id then the new product will be create instead of updation
        if(category){
            //  check whether category exists or not
            const categoryExists=await Category.findById(category)
            if(!categoryExists){
                return response.status(400).json({
                    success:false,
                    message:`Category does not exists`
                })
            }
            // agar available hai toh category me category daal do
              productExists.category=category;

            } 
            
        // agar title hai toh bs whi update ho rest fields undefined nhi mark honi chahiye .. bcz we are not using findByIdAndDelete() method actually findByIdAndDelete() this method only set those field which we want to upadate and new:true will returns the new documents
            if(title){
             productExists.title=title;
            }
             if(description){
              productExists.description=description;
            }
            // agar price undefined aya body se toh update nhi kro
            if(price!==undefined){
              productExists.price=price;
            }
            if(stock!==undefined){
              productExists.stock=stock;
            }
            if(images){
              productExists.images=images;
            }
            
            await productExists.save()

            return response.status(200).json({
                success:true,
                message:`Product data updated successfully`,
                data:productExists,
            })
    }
    catch(error){
        console.log(error)
        return response.status(500).json({
            success:false,
            error:error.message,
            message:`Something went wrong while updating the product`
        })
    }
}

//deleteProduct

exports.deleteProduct=async(request,response)=>{
    try{
        const {productId}=request.params;
        //check whether product present or not
        const isProduct=await Product.findById(productId);
        if(!productId){
            return response.status(400).json({
                success:false,
                message:`Product does not found whith the specific id`
            })
        }

        // if product found
        const deleteProduct=await Product.findByIdAndDelete(productId)
        return response.status(200).json({
            success:true,
            message:`Product deleted successfully`
        })
    }

    catch(error){
        console.log(error);
        return response.jaosn({
            success:false,
            error:error.message,
            message:`Something went wrong while deleting product`
        })
    }
}


// getAllProductsBy search query

exports.searchAllProductsByQuery=async(request,response)=>{
    try{

        const {page=1,limit=2,search,category,minPrice,maxPrice,sort}=request.query;
        const pageNumber = Number(page); //* - + yh sb convert krdete hain string ko number me but yaha e krna better apprach hai
        const limitNumber = Number(limit);
        const query={}
        if(search){
            query.title={ // agar serach hai use search field me add krdo
                $regex:search,
                $options:'i'
            }
        }
         
        // agar category hai toh use bhi query ke metyobject me add krdo  
        if(category){
            query.category=category
        }

        if(minPrice||maxPrice){
            query.price={}

            if(minPrice){
                query.price.$gte=Number(minPrice); // agar minPrice ya maxPrice aa rha hai toh uske liye new field query me add krdo price ki or jo max min value aa rhi hai usme check krlo ke jo bhi min value ho wh 1000 se zyda ho or 5000 se kam for filtering its a range like user ko phone chahiye jo 30000 se 50000 ki range ka ho isliye yh kr rhe hain
            }
            if(maxPrice){
                query.price.$lte=Number(maxPrice)
            }
        }
        // sorting
        // let say user didnot sort 
        let sortOption={createdAt:-1}// initially descending order;
    
        // sort jo query se aya or user ne ascending order me chose kra hai product price listing -> PRICE ASCENDING MEANS LOW TO HIGH
       if(sort==='price_asc'){
        sortOption={price:1}
       }

       // USER SORT ON THE BASIS OF PRICE ASCENDING MEANS HIGH TO LOW
       if(sort==='price_desc'){
        sortOption={price:-1}
       }

       // latest product show ho
        if(sort==='latest'){
        sortOption={createdAt:-1}
       }
       // oldest product
        if(sort==='oldest'){
        sortOption={createstAt:1}
       }

       const getallProductbySearchQuery=await Product.find(query).populate('category','name slug').sort(sortOption).limit(limitNumber).skip((pageNumber-1)*limitNumber)
       const totalDocuments=await Product.countDocuments(query) // total douments for finding totalPages 

       // find returns an array so we can use getallProductgetallProductbySearchQuery.length for finding total documents

       return response.status(200).json({
        success:true,
        message:`Product data fetched successfully by query `,
        data:getallProductbySearchQuery,
        curentPage:pageNumber,
        limit:limitNumber,
        totalProducts:totalDocuments,
        totalPages:Math.ceil(totalDocuments/limit),
        skip:(pageNumber-1)*limit

       })
        
    }
    catch(error){
        console.log(error);
        return response.status(500).json({
            success:false,
            error:error.message,
            message:`Something went wrong while fetch all product by search query`
        })
    }
}


