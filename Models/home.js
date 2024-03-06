const mongoose = require("mongoose")

const bannerSchema =new mongoose.Schema({
    backgroundUrlSm : {
        type: String,
        require: 'true',
    },
    backgroundUrlLg : {
        type: String,
        require: 'true',
    },
    backgroundText : {
        type: String,
        require: 'true',
    },
    serviceHeading : {
        type: String,
        require: 'true',
    },
    serviceDescription : {
        type: String,
        require: 'true',
    },
    examHeading : {
        type: String,
        require: 'true',
    },
    examDescription : {
        type: String,
        require: 'true',
    },
    acoFeautureHeading : {
        type: String,
        require: 'true',
    },
    acoFeautureDescription : {
        type: String,
        require: 'true',
    },
    bannerUrl : {
        type: String,
        require: 'true',
    } ,
    travelFeautureHeading : {
        type: String,
        require: 'true',
    },
    travelFeautureDescription : {
        type: String,
        require: 'true',
    },
    faqHeading : {
        type: String,
        require: 'true',
    },
    faqDescription : {
        type: String,
        require: 'true',
    }
})

module.exports = mongoose.model("home",bannerSchema);