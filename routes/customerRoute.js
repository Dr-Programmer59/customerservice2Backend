const express=require("express")
const {isAuthenticatedUser,isAuthorizeRole}=require("../middleware/auth");
const { getAllCustomer, getCustomer, updateCustomer, deleteCustomer, createCustomer } = require("../controllers/customerController");

const router=express.Router();

router.route("/customers").get(getAllCustomer);
router.route("/customer/:id").put(updateCustomer).delete(deleteCustomer);
router.route("/customer/login").post(getCustomer)
router.route("/customer/signup").post(createCustomer)

module.exports=router;
