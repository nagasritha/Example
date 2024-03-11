const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    message : {
        type:String,
        require: true
    },
    email: {
        type : String,
        require : true
    }
})

module.exports = mongoose.model("notifications", notificationSchema);
