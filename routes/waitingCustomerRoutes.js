const express=require("express")
const {isAuthenticatedUser,isAuthorizeRole}=require("../middleware/auth");
const { getwaitingCustomer, updatewaitingCustomer, deletewaitingCustomer, getAllwaitingCustomer, createwaitingCustomer } = require("../controllers/waitingCustomerController");
const router=express.Router();

router.route("/waitingcustomers").get(getAllwaitingCustomer)
router.route("/waitingcustomer").post(createwaitingCustomer);

router.route("/waitingcustomer/:id").delete(deletewaitingCustomer).get(getwaitingCustomer);

module.exports=router;
