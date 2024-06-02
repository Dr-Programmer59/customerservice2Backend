const express=require("express");
const { model, models } = require("mongoose");
const cors= require('cors')
const app=express();
const errorMiddleware=require("./middleware/error")
const cookieParser=require("cookie-parser")
const dotenv=require("dotenv")


dotenv.config({path:"config/config.env"})
console.log(process.env.FRONTEND_EMPLOYEE," ",process.env.FRONTEND_ADMIN)
app.use(cors({
    origin: [process.env.FRONTEND_EMPLOYEE,process.env.FRONTEND_ADMIN,process.env.FRONTEND_CUSTOMER],
    credentials: true, // Include cookies in CORS requests if needed
  }));
  
app.use(express.json())
app.use(cookieParser())
// Route imports


const user=require("./routes/userRoute")
const conversationR=require("./routes/conversationRoute.js")
const msgR=require("./routes/messageRoute.js")
const customerR=require("./routes/customerRoute.js")



//middler ware for error


app.use("/api/v1",user)
app.use("/api/v1",conversationR)
app.use("/api/v1",msgR)
app.use("/api/v1",customerR)









app.use(errorMiddleware)




module.exports=app;
