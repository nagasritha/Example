const mongoose = require("mongoose");

const examCitySchema = new mongoose.Schema({
   name : {
    type : String,
    require : true
   },
   cityUrl : {
    type : String,
    require : true
   }
})

module.exports = mongoose.model("ExamCities", examCitySchema);