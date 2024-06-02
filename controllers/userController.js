const User=require("../models/userModel")
const  AsyncErrorHandler=require("../middleware/AsyncErrorHandler")
const ErrorHandler=require("../utils/errorhandler")
const sendToken=require("../utils/jwtToken")
const sendEmail=require("../utils/sendEmails")
const crypto=require("crypto")

exports.registerUser=AsyncErrorHandler(async(req,res)=>{
    console.log("in register ",req.body)
    const {name,email,password,category,role,profileImage}=req.body;

    const user= await User.create({
        profileImage,name,email,password,category,role
       
    })
    console.log("someone is trying to register ",user)
    if(!user){
        return next(new ErrorHandler("Not Created",401));
       
    }
    res.status(200).json({
        sucess:true,
        msg:"User Created Scuessfully!",
        user
    })
})
exports.loginUser=AsyncErrorHandler(async(req,res,next)=>{
    console.log("login trigger")
    const{email,password}=req.body;
    if(!email || !password){
        return next(new ErrorHandler("Please Enter the Email or Password",400))
    }
    const user=await User.findOne({email}).select("+password")
    if(!user){
    console.log("in login")

        return next(new ErrorHandler("Invalid Email OR passsword",401));
    }
    const passwordMatched=await user.comparePassword(password);
    if(!passwordMatched){
        return next(new ErrorHandler("Invalid Email OR passsword",401));
    }
    
   sendToken(user,res,200);

})


exports.logoutUser=AsyncErrorHandler(async(req,res,next)=>{
    res.cookie("token",null,{
        expires:new Date(Date.now()),
        httpOnly:true,
    });
    res.status(200).json({
        success:true,
        message:"logout",
    })

})
exports.forgotPassword=AsyncErrorHandler(async(req,res,next)=>{
    const user=await User.findOne({email:req.body.email});
    if(!user){
        return next(new ErrorHandler("User not found !",404))
    }
    // console.log(user)
    const resetToken=await user.generateResetPasswordToken();
    await user.save({ValidateBeforeSave:false})

    const resetUrl=`${req.protocol}://${req.get("host")}/api/v1/resetPassword/${resetToken}`;
    const msg=`Your password Reset token is ${resetUrl} .\n\n\n If you have not requested it then ignore it`;

    try{
        await sendEmail({
            email:user.email,
            subject:`Ecomerce Password Recovery`,
            msg:msg,

        });
        res.status(200).json({
            sucess:true,
            msg:"Email sent to User Scuessfully!"
        })
    }
    catch(err){
        user.resetPasswordExpire=undefined;
        user.resetPasswordToken=undefined;
    await user.save({ValidateBeforeSave:false})
        return next(new ErrorHandler(err.message,500))

    }
})
exports.resetPassword=AsyncErrorHandler(async(req,res,next)=>{
    const resetPasswordToken=crypto.createHash("sha256").update(req.params.token).digest("hex");
    const user=await User.findOne({
        resetPasswordToken,
        resetPasswordExpire:{$gt:Date.now()}
          
    })
    if(!user){
        return next(new ErrorHandler("Password reset token is invalid or expired",400))
    }
    if(req.body.password!=req.body.confirmpassword){
        return next(new ErrorHandler("Password not matched",400))

    }

    user.password=req.body.password;
    user.resetPasswordToken=undefined;
    user.resetPasswordExpire=undefined;

    await user.save();

    sendToken(user,res,200);


})
exports.getUserDetail=AsyncErrorHandler(async (req,res,next)=>{
    console.log("in me")
    
    const user=await User.findById(req.user.id);
    console.log(user)
    res.status(200).json({
        sucess:true,
        user,
    })
})

exports.updatePassword=AsyncErrorHandler(async(req,res,next)=>{
    const user=await User.findById(req.body.id).select("+password");

    const isPasswordMatched=await user.comparePassword(req.body.oldpassword);
    if(!isPasswordMatched){
        return next(new ErrorHandler("Wrong Password !",400));
    }
    if(req.body.password=req.body.confirmpassword){
        return next(new ErrorHandler("Confirm Password not matched",400));
    }

    user.password=req.body.password;
    await user.save();
    sendToken(user,res,200);


})

exports.updateProfile=AsyncErrorHandler(async(req,res,next)=>{
    console.log("in update profile")
    const newUserdata={
        name:req.body.name,
     
        category:req.body.category
    };
    const user=await User.findByIdAndUpdate(req.params.id,newUserdata);
    if(!user){
        console.log("something goes wrong")
    }
    console.log("sucessfully done")
    res.status(200).json({
        sucess:true,
    
    })

})
exports.getAlluser=AsyncErrorHandler(async(req,res,next)=>{
    const users=await User.find();
    res.status(200).json(
        {
            sucess:true,
            users,
        }
    )
})
exports.getSingleuser=AsyncErrorHandler(async(req,res,next)=>{
    
    const user=await User.findById(req.params.id);
    if(!user){
        return next(new ErrorHandler(`User not exists with Id:${req.params.id}`,404))
    }
    console.log("yser")
    res.status(200).json(
        {
            sucess:true,
            user,
        }
    )
})
exports.updateUserRole=AsyncErrorHandler(async(req,res,next)=>{
    const newUserdata={
        name:req.body.name,
        email:req.body.email,
        role:req.body.role,
    };
    const user=await User.findByIdAndUpdate(req.user.id,newUserdata);
    if(!user){
        console.log("something goes wrong")
    }
    res.status(200).json({
        sucess:true,
    
    })

})

exports.deleteUser=AsyncErrorHandler(async(req,res,next)=>{
    const user=await User.findById(req.params.id);
    if(!user){
        return next(new ErrorHandler(`User not exists with Id:${req.params.id}`,404))
    }
    await User.deleteOne(user)

    res.status(200).json(
        {
            sucess:true,
            
        }
    )
})
