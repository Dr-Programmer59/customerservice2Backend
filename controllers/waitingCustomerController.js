const waitingCustomer=require("../models/waitingCustomerModel")
const  AsyncErrorHandler=require("../middleware/AsyncErrorHandler")
const ErrorHandler=require("../utils/errorhandler")
const sendToken=require("../utils/jwtToken")
const sendEmail=require("../utils/sendEmails")
const crypto=require("crypto")



exports.getAllwaitingCustomer=AsyncErrorHandler(async (req,res,next)=>{
    console.log("in me")
    
    const messages=await waitingCustomer.find();
    res.status(200).json(
        {
            sucess:true,
            messages,
        }
    )
})

exports.getwaitingCustomer = AsyncErrorHandler(async (req, res, next) => {
    console.log("in me");
    // Find the waitingCustomer document by phone number
    const waitingcust = await waitingCustomer.findOne(req.params.id)  
    // Access the messages field of the waitingCustomer document
    console.log("waitingCustomer messages:", messages);

    res.status(200).json({
        success: true,
        waitingcust // You can send the messages back to the client if needed
    });
});


exports.createwaitingCustomer=AsyncErrorHandler(async(req,res)=>{
  
    const {phone}=req.body;

    const userMessage= await waitingCustomer.create({
        phone
    })
   
    if(!userMessage){
        return next(new ErrorHandler("Not Created",401));
       
    }
    res.status(200).json({
        sucess:true,
        msg:"waitingCustomer Created Scuessfully!"
    })
})







// exports.loginwaitingCustomer=AsyncErrorHandler(async(req,res,next)=>{
//     console.log("login trigger")
//     const{name,phone}=req.body;
//     if(!email || !password){
//         return next(new ErrorHandler("Please Enter the Email or Password",400))
//     }
//     const user=await User.findOne({email}).select("+password")
//     if(!user){
//     console.log("in login")

//         return next(new ErrorHandler("Invalid Email OR passsword",401));
//     }
//     const passwordMatched=await user.comparePassword(password);
//     if(!passwordMatched){
//         return next(new ErrorHandler("Invalid Email OR passsword",401));
//     }
    
//    sendToken(user,res,200);

// })

exports.deletewaitingCustomer=AsyncErrorHandler(async(req,res,next)=>{
    const waitingcust=await waitingCustomer.findById(req.params.id);
    if(!waitingcust){
        return next(new ErrorHandler("waitingCustomer not found",404))
    }
    await waitingCustomer.deleteOne(waitingcust);
    res.status(200).json({
        sucess:true,
        msg:"waitingCustomer Deleted Sucessfully"
    })
})