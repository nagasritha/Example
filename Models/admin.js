const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema(
    {
        email : {
            type : String,
            require:true,
            unique : true
        }
    }
)

module.exports = mongoose.model("admin", adminSchema);