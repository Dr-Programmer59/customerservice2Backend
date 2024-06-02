const express=require("express")
const {isAuthenticatedUser,isAuthorizeRole}=require("../middleware/auth");
const { newConversation, getConversation, addMember, getAdminConversation, getEmployeeConversation } = require("../controllers/Converation");

const router=express.Router();

router.post('/conversation/add', newConversation);
router.post('/conversation/get', getConversation);
router.post('/conversation/addMember/:id', addMember);
router.get('/conversation/admin/get', getAdminConversation);
router.get("/conversation/employee/get/:id",getEmployeeConversation)


module.exports=router;
