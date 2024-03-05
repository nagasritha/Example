const mongoose = require('mongoose');

const enquireSchema = mongoose.Schema({
    user_id : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'LoggedinUsers',
        require: true
    },
  name : String,
  whatsapp_number:Number,
  address:String,
  exam_city : String,
  exam_center : String,
  admit_card_path : String,
  exam : String,
  bus_stop: String,
  service : {
    type:String,
    require:true,
    unique : true
  },
  email : String
})

module.exports = mongoose.model("enquire",enquireSchema);