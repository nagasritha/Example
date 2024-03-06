const mongoose = require("mongoose");

const servicesSchema = mongoose.Schema({
    name:{
        type:String,
        require : true
    },
    serviceUrl : {
        type : String,
        require : true,
        unique : true
    }
})

module.exports = mongoose.model("providedServices",servicesSchema);