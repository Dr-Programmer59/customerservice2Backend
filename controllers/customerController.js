const Customer=require("../models/customerModel")
const  AsyncErrorHandler=require("../middleware/AsyncErrorHandler")
const ErrorHandler=require("../utils/errorhandler")
const sendToken=require("../utils/jwtToken")
const sendEmail=require("../utils/sendEmails")
const crypto=require("crypto")



exports.getAllCustomer=AsyncErrorHandler(async (req,res,next)=>{
    console.log("in me")
    
    const messages=await Customer.find();
    res.status(200).json(
        {
            sucess:true,
            messages,
        }
    )
})

exports.getCustomer = AsyncErrorHandler(async (req, res, next) => {
    console.log("in me");

    const { phone } = req.body;
    console.log(phone)
    // Find the customer document by phone number
    const customer = await Customer.findOne({ phone }).select("+messages");

    if (!customer) {
        return next(new ErrorHandler("Not found",401));
    }

    // Access the messages field of the customer document
   

    console.log("Customer messages:", messages);

    res.status(200).json({
        success: true,
        customer // You can send the messages back to the client if needed
    });
});


exports.createCustomer=AsyncErrorHandler(async(req,res)=>{
  
    const {phone,status}=req.body;
    const alreadyexists=await Customer.findOne({phone})

    if(alreadyexists){
        res.status(200).json({
            sucess:false,
            msg:"already exixsts",
            customer:alreadyexists
           
        })

        return;
    }
    const userMessage= await Customer.create({
        phone,status
    })
   
    if(!userMessage){
        // return next(new ErrorHandler("Not Created",401));
        res.status(200).json({
            sucess:false,
            msg:"not Created",
           
        })
        return;
    }
    res.status(200).json({
        sucess:true,
        msg:"Customer Created Scuessfully!",
        customer:userMessage
    })
})

exports.updateCustomer=AsyncErrorHandler(async(req,res,next)=>{

    try {
        const {phone,message}=req.body;

        const customer = await Customer.findById(req.params.id);
        
        if (!customer) {
            console.log('customer not found');
            return null;
        }
        console.log("trying to updating")
        await customer.addMessageToCustomer( message);
        // Check if customer ID exists in the customers object
     
        // Save the updated customer document
     
        
    } catch (error) {
        console.error('Error updating customer messages:', error);
        throw error;
    }
    res.status(200).json({
        sucess:true,
    
    })

})
// exports.logincustomer=AsyncErrorHandler(async(req,res,next)=>{
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

exports.deleteCustomer=AsyncErrorHandler(async(req,res,next)=>{
    const Customer=await Customer.findById(req.params.id);
    if(!Customer){
        return next(new ErrorHandler("Customer not found",404))
    }
    await Customer.deleteOne(Customer);
    res.status(200).json({
        sucess:true,
        msg:"Customer Deleted Sucessfully"
    })
})