const mongoose = require("mongoose")

const bannerSchema =new mongoose.Schema({
    bannerUrl : {
        type: String,
        require: 'true',
    } 
})

module.exports = mongoose.model("banner",bannerSchema);