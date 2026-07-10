const mongoose=require('mongoose')
require('dotenv').config();
const MONGODB_URL=process.env.MONGODB_URL
exports. databaseConnection=async()=>{
try{
await mongoose.connect(MONGODB_URL);
console.log(`Database Connection Successfull`)
}
catch(error){
    console.log (error);
    process.exit(1)
}
}