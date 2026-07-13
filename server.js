const express=require('express')
const app=express()
app.use(express.json())
const cookieParser=require('cookie-parser')
require('dotenv').config()
const cors=require('cors')
app.use( cors({
    origin: "http://localhost:5173", // react url
    credentials: true,
  })
);
app.use(cookieParser());
const PORT= process.env.PORT;
const dbConnect=require('./config/database')
const userRoutes=require('./routes/userRoute')
const categoryRoute=require('./routes/categoryRoute')
const productRoute=require('./routes/productRoute')
const cartRoute=require('./routes/cartRoute')
const otpRoute=require('./routes/otpRoute')
const protectedRoute=require('./routes/protectedRoute')
const orderRoute=require('./routes/orderRoute')
const reviewRoute=require('./routes/reviewRoute')
const addressRoute=require('./routes/addressRoute')
app.use('/api',userRoutes)
app.use('/api',categoryRoute)
app.use('/api',productRoute)
app.use('/api',cartRoute)
app.use('/api',otpRoute)
app.use('/api',protectedRoute)
app.use('/api',orderRoute)
app.use('/api',reviewRoute)
app.use('/api',addressRoute)

app.get('/home',(request,response)=>{
    response.send(`<h1>Welcome to the HOME PAGE </h1>`)
})
dbConnect.databaseConnection();

app.listen(PORT,()=>{
console.log(`Server is running at Port ${PORT}`)
})
