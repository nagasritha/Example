const cloudinary = require('cloudinary').v2;

const images = require('../Models/webImages')

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  secure: true,
});

const uploadFile = async(filepath)=>{
    let result = null 
    try{
       const data = await images.findOne({imagePath : filepath});
       if(data == null){
        const url = await cloudinary.uploader.upload(filepath);
        result = url.secure_url;
        const imageData = new images({imagePath : filepath, imageUrl : result});
        await imageData.save();
       }else{
         result = data.imageUrl;
       }
       console.log(result);
       return result
    }
    catch(error) { 
        console.log(error.message);
    }
}

module.exports ={ uploadFile }