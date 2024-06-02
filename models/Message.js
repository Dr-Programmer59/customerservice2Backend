const mongoose=require("mongoose")

const MessageSchema = new mongoose.Schema({
    conversationId: {
        type: String
    },
    roomId:{
        type:String,
    },
    senderId: {
        type: String
    },
   
    text: {
        type: String
    },
    type: {
        type: String
    },
    sourceLink:{
        type:String,
        
    }
},
{ 
        timestamps: true
})

const message = mongoose.model('Message', MessageSchema);
module.exports = message;