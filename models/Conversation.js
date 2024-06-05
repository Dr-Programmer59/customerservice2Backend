const mongoose=require("mongoose")
const Customer=require("./customerModel")
const Employee=require("./userModel")

const ConversationSchema = new mongoose.Schema({
    roomId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:Customer

    },
    employeeId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:Employee,
    
    },
    newMessages:{
        type:Number,
    },
    members: {
        type: Array
    },
    message: {
        type: String
    }},
    {
        timestamps: true
    }
);

ConversationSchema.methods.addMember = async function(memberId) {
    if (!this.members.includes(memberId)) {

        this.employeeId=memberId;
        
        this.members.push(memberId);
        await this.save();
    }
    return this;
};
const conversation = mongoose.model('Conversation', ConversationSchema);

module.exports = conversation;