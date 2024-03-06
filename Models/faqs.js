const mongoose = require("mongoose");
const faqSchema = new mongoose.Schema({
question : {
    type: String,
    require : true
},
answer : {
    type : String,
    require : true
}
})

module.exports = mongoose.model("faqs" , faqSchema);
