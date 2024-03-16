const mongoose = require("mongoose");

const schema = mongoose.Schema({
    name : {
        type:String,
        required : true,
        unique: true
    },
    imageUrl : {
        type :String,
        required : true
    },
    email : {
        type: String,
        required : true
    },
    userId:{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'LoggedinUsers',
        required : true 
    },
    exam : {
        type: String,
        required : true
    },examCity :{
        type: String,
        required : true
    },whatsappNumber : {
        type: Number,
        required : true
    },city :{
        type: String,
        required : true
    },
    examCenter :{
        type: String,
        required : true
    }

});

module.exports = mongoose.model('Name',schema);