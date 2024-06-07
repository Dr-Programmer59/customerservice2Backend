
const Message=require("../models/Message.js")
const Conversation=require("../models/Conversation.js")

exports.newMessage = async (request, response) => {
    const newMessage = new Message(request.body);
    try {
        await newMessage.save();
        if(request.body.roomId==request.body.senderId){
        await Conversation.findByIdAndUpdate(request.body.conversationId, { message: request.body.text,$inc: { newMessages: 1 } });
        }
        else{
            await Conversation.findByIdAndUpdate(request.body.conversationId, { message: request.body.text})
        }
        response.status(200).json("Message has been sent successfully");
    } catch (error) {
        response.status(500).json(error);
    }

}

exports.getMessage = async (request, response) => {
    try {
        const messages = await Message.find({ conversationId: request.params.id });
        response.status(200).json(messages);
    } catch (error) {
        response.status(500).json(error);
    }

}