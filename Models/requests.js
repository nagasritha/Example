const mongoose = require("mongoose");

const requestSchema = mongoose.Schema({
    userId:{
        type:String,
        require: true
    },
    email :{
        type:String,
        require: true
    },
    name:{
        type: String,
        require:true
    },
    whatsappNumber : {
        type:Number,
        require : true
    },
    address : {
        type : String,
        require:true
    },
    city :{
        type : String,
        require:true
    },
    busStop : {
        type : String,
        require:true
    },
    admitCard : {
        type : String,
        require : true
    },
    serviceType :{
        type : String,
        require:true
    },
    exam : {
        type : String,
        require:true
    },
    examDate : {
        type : Date,
        require:true
    },
    examCity : {
        type : String,
        require:true
    },
    examCenter : {
        type : String,
        require:true
    },
    requestStatus  : {
        type : String,
        default : "Pending",
    },
    serviceStatus : {
        type : String,
        default : "Yet to start"
    }
});

module.exports = mongoose.model('Requests',requestSchema);