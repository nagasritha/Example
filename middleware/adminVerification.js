const admin = require("../Models/admin");

const adminVerification = async(request,response,next)=>{
    const {email} = request
    console.log("I am called")
    console.log(email);
    const data = await admin.findOne({email});
    console.log(data);
    if(data!==null){
       next(); 
    }
    else{
        response.status(400).send({"message":"Only Admins have an access."});
    }
}

module.exports = adminVerification