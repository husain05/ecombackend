const express=require('express')
const app=express()
app.use(express.json())
const cookieParser=require('cookie-parser')
require('dotenv').config()
app.use(cookieParser());
const PORT= process.env.PORT;
const dbConnect=require('./config/database')
const userRoutes=require('./routes/userRoute')
const categoryRoute=require('./routes/categoryRoute')
const productRoute=require('./routes/productRoute')
const cartRoute=require('./routes/cartRoute')
app.use('/api',userRoutes)
app.use('/api',categoryRoute)
app.use('/api',productRoute)
app.use('/api',cartRoute)


app.get('/home',(request,response)=>{
    response.send(`<h1>Welcome to the HOME PAGE </h1>`)
})
dbConnect.databaseConnection();

app.listen(PORT,()=>{
console.log(`Server is running at Port ${PORT}`)
})
