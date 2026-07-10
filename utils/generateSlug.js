const slugify=require('slugify')

exports.generateSlug=(name)=>{
return slugify(name,{
    lower:true,
    strict:true,
    trim:true,
})
}