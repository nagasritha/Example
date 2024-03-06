const mongoose = require('mongoose');

const imagesSchema = mongoose.Schema({
    imagePath : {
        type : String,
        require : true,
        unique : true
    },
    imageUrl : {
        type : String,
        require :true,
        unique : true
    }
})

module.exports = mongoose.model("images", imagesSchema);