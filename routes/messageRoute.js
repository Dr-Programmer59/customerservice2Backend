const express=require("express")
const {isAuthenticatedUser,isAuthorizeRole}=require("../middleware/auth");
const { newMessage, getMessage } = require("../controllers/messageController");

const router=express.Router();

router.post('/message/add', newMessage);
router.get('/message/get/:id', getMessage);

module.exports=router;
