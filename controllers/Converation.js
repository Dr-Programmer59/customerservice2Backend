
const Conversation=require("../models/Conversation")
exports.newConversation = async (request, response) => {
    let roomId = request.body.roomId;
    let receiverId = request.body.receiverId;
    let senderId = request.body.senderId;
    const exist = await Conversation.findOne({ roomId: roomId });
    
    if(exist) {
        response.status(200).json('conversation already exists');
        return;
    }
    const newConversation = new Conversation({
        roomId,members: [senderId, receiverId]
    });

    try {
        const savedConversation = await newConversation.save();
        response.status(200).json(savedConversation);
    } catch (error) {
        response.status(500).json(error);
    }

}

exports.addMember=async (request,response)=>{
    try {
        const {memberId}=request.body;
        const conversation = await Conversation.findById(request.params.id);
        if (conversation) {
            await conversation.addMember(memberId);
            response.status(200).json(conversation);
        } else {
            response.status(500).json(error);
        
        }
    } catch (error) {
        response.status(500).json(error);
        
    }
}
exports.getConversation = async (request, response) => {
    try {
        const conversation = await Conversation.findOne({ roomId: request.body.roomId }).populate('employeeId');
        response.status(200).json(conversation);
    } catch (error) {
        response.status(500).json(error);
    }

}
exports.clearChatMessages = async (request, response) => {
    try {
        const conversation = await Conversation.findByIdAndUpdate(request.params.id,{ newMessages:0 });
        response.status(200).json(conversation);
    } catch (error) {
        response.status(500).json(error);
    }

}


exports.getAdminConversation = async (request, response) => {
    try {
        const conversation = await Conversation.find().populate('roomId').populate('employeeId');
        response.status(200).json(conversation);
    } catch (error) {
        response.status(500).json(error);
    }

}

exports.getEmployeeConversation = async (request, response) => {
    try {
        const employeeId=request.params.id;

        const conversation = await Conversation.find({employeeId}).populate('roomId');
        response.status(200).json(conversation);
    } catch (error) {
        response.status(500).json(error);
    }

}

