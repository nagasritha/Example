const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema({
    logo : {
        type : String,
        require : true,
    },
    title : {
        type :String,
        require : true
    },
    description : {
        type : String,
        require : true
    },
    cardParent: {
        type: String,
        required: true,
        enum: ['STATS', 'ACOFEAUTURE', 'TRAVELFEAUTURE'] // Restrict values to 'stats', 'acoFeauture', or 'travelFeauture'
    }
})

module.exports = mongoose.model("cards",cardSchema);