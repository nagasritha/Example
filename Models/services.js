const mongoose = require("mongoose");

const servicesSchema = mongoose.Schema({
    serviceUrl : {
        type : String,
        require : true,
        unique : true
    }
})

module.exports = mongoose.model("providedServices",servicesSchema);