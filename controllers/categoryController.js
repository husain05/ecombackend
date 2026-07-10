const Category=require('../models/Category');
const { generateSlug } = require('../utils/generateSlug');

exports.createCategory=async(request,response)=>{
try{
    const {name,description}=request.body;
    // check if name field is available or not
    if(!name){
        return response.status(400).json({
            success:false,
            message:`All field are required to be filled`
        })
    }
    // check whether category exists or not 
    const existingCategory=await Category.findOne({name});
    if(existingCategory){
        return response.status(400).json({
            success:false,
            message:`Category is alredy present`
        })
    }
    // if not presen craete slug

    const slug=generateSlug(name);
    // create Category
    const createCategory=await Category.create({
        name,
        description,
        slug
    })

    // now return successful response
    return response.status(200).json({
        success:true,
        message:`Category created successfully`,
        data:createCategory
    })
}
catch(error){
    console.log(error);
    return response.status(500).json({
        error:error.message,
        success:false,
        message:`Something went wrong while creting Category`
    })
}
}

// getAllCategory
exports.getAllCategory=async(request,response)=>{
    try{
        // get all categories
         const allCategories=await (await Category.find({})).sort({createdAt:-1})
         if(allCategories.length===0){
            return response.status(400).json({
                success:false,
                messge:`Category not present`
            })
         }

         // if present then return response
         return response.status(200).json({
            success:true,
            message:`All categories fetched successfully`,
            count:allCategories.length,
            data:allCategories

         })
    }
    catch(error){
        console.log(error)
        return response.status(500).json({
            success:false,
            error:error.message,
            message:`Something went wrong while fetching all categories`
        })
    }
}

// get single category

exports.getSingleCategory=async(request,response)=>{
    try{
        const {categoryId}=request.params;
        // check whether category present with specific id or not 
        const isCategoryPresent=await Category.findById(categoryId);
        if(!isCategoryPresent){
            return response.status(400).json({
                success:false,
                message:`Category not present with this specific id`
            })
        }
        // if present
        return response.status(200).json({
            success:true,
            message:`Category fetched successfully with the specific id `,
            data:isCategoryPresent
        })
    }

    catch(error){
        console.log(error);
        return response.status(500).json({
            success:false,
            error:error.message,
            message:`Something went wrong while fetching category`
        })
    }
}

//update category

exports.updateCategory=async(request,response)=>{
    try{
        const {categoryId}=request.params;
        const {name,description}=request.body
        // check whether the category exists or not
        const isCategoryPresent=await Category.findById(categoryId);
        if(!isCategoryPresent){
            return response.status(400).json({
                success:false,
                message:`Category is not present with specific id`
            })
        }
        // if present check whether name field is filled or not
        if(!name){
            return response.status(400).json({
                success:false,
                message:`All field are required`
            })
        }
        // call generateSlug() function and send name in this function
        const slug=generateSlug(name)
        // now update the category

        const updateCategory=await Category.findByIdAndUpdate({_id:categoryId},{name:name,description:description,slug:slug},{new:true,runValidators:true})
        // return succesfull response
        return response.status(200).json({
            success:true,
            message:`Category updated sucessfully`,
            data:updateCategory
        })
    }
    catch(error){
        console.log(error);
        return response.status(500).json({
            success:false,
            error:error.message,
            message:`Something went wrong while updating category`
        })
    }
}

// deleteCategory

exports.deleteCategory=async(request,response)=>{
try{
const {categoryId}=request.params;
const isCategoryPresent=await Category.findById(categoryId);
if(!isCategoryPresent){
    return response.status(400).json({
        success:false,
        error:error.message,
        message:`Category is not present with the specific id`
    })
} 

// if category present
const deleteCategory=await Category.findByIdAndDelete(categoryId)
// now return successfull response
return response.status(200).json({
    success:true,
    message:`Category deleted successfully`
})
}
catch(error){
console.log(error);
return response.status(500).json({
    success:false,
    error:error.message,
    message:"Something went wrong while deleting category"
})
}
}