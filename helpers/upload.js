const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  secure: true,
});

const uploadFile = async(filepath)=>{
     
    try{
        const result = await cloudinary.uploader.upload(filepath);
        console.log(result);
        return result.secure_url;
    }
    catch(error) { 
        console.log(error.message);
    }
}

module.exports ={ uploadFile }