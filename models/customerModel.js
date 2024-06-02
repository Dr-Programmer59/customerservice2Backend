const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for customer messages

// Define the schema for the Customer data
const CustomerSchema = new Schema({
    phone:{
        type:String,
        required:true
    },
    
});

// Method to add a message for a customer
CustomerSchema.methods.addMessageToCustomer = async function(message) {
    if(message !== ""){
        this.messages.push(message);
    }
    return this.save();   
};

// Create a model for the Customer schema
const Customer = mongoose.model('Customer', CustomerSchema);

module.exports = Customer;
