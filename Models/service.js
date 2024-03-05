const mongoose = require('mongoose');

const serviceSchema = mongoose.Schema({
    heading : {
        type:String,
        require: true
    },
    description : {
        type:String,
        require: true
    }

})

module.exports = mongoose.model('service',serviceSchema);