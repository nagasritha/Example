const mongoose = require('mongoose');

const profileSchema =new mongoose.Schema({
    user_id : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'LoggedinUsers',
        require: true
    },
    image_url: String,
  name: String,
  education_status: String,
  about: String,
  phone_number: {
    type: Number,
    required: true,
    unique: true,
    validate: {
      validator: function(v) {
        // Check if phone number is a number and has 10 digits
        return /^\d{10}$/.test(v.toString()); // Validate 10-digit number
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  address: String,
  country: String,
  state:String,
  email: String,
  insta_profile: String,
  twitter_profile: String,
  facebook_profile: String,
  linkedin_profile: String

});

module.exports = mongoose.model('Profile', profileSchema);