const User = require("../models/userModel");
const ErrorHandler = require("../utils/errorhandler");
const AsyncErrorHandler = require("./AsyncErrorHandler");
const jwt=require("jsonwebtoken")

exports.isAuthenticatedUser=AsyncErrorHandler(async(req,res,next)=>{
    console.log("in authentication")
    const {token}=req.cookies;
  
    if(!token){
        return next(new ErrorHandler("Please Login or signup For Acessing this Resources",401));
    }
    const decodedData=await jwt.verify(token,process.env.JWT_SECRETKEY);

    req.user=await User.findById(decodedData.id);
    console.log(req.user)
    next();

    
})
exports.isAuthorizeRole=(...roles)=>{
    return(req,res,next)=>{
    if(!roles.includes(req.user.role)){
        return next(new ErrorHandler(`${req.user.role} is not Allowed to acess this resouces`,401))
    }
    next();
    }
}