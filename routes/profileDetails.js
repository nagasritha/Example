const express = require('express');
const multer = require('multer');
const {differenceInDays} = require('date-fns');
const authenticateToken = require("../middleware/authentication");

const router = express();
router.use(express.json());

//collection
const profile = require('../Models/profile');
const enquire = require('../Models/enquire');
const Name = require('../Models/test');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/') // Store uploaded files in the 'uploads' directory
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
  });
  
const upload = multer({ storage: storage });
const imageUploder = require("../helpers/upload");

router.post('/submit-profile', authenticateToken, upload.single('profileUrl'), async (request, response) => {
   
    const { name, about, educationStatus, phoneNumber, address, country, state, instaProfile, twitterProfile, facebookProfile, linkedinProfile } = request.body;
    const { id, email } = request;
    try {
        const user_id = id;
        const imageUrl=await imageUploder.uploadFile(request.file.path);
        const existing = await profile.findOne({ email });

        const data = {
            name,
            about,
            education_status: educationStatus,
            phone_number: phoneNumber,
            address,
            country,
            state,
            insta_profile: instaProfile,
            twitter_profile: twitterProfile,
            facebook_profile: facebookProfile,
            linkedin_profile: linkedinProfile,
            email,
            user_id,
            image_url: imageUrl
        };

        if (!existing) {
            const insertDetails = new profile(data);
            await insertDetails.save();
            response.status(200).send({ "message": "Profile Details added" });
        } else {
            await profile.findOneAndUpdate({ email }, data);
            response.status(200).send({ "message": "Profile updated Successfully" });
        }
    } catch (err) {
        console.log(err);
        response.status(400).send({ "Message": "Failed to push the data" });
    }
});

router.get('/eachProfile',authenticateToken,async(request,response)=>{
    try{
        const {email} = request;
    const profileData= await profile.findOne({email});
    response.status(200).send({"UserDetails":profileData});
    }
    catch(error){
        response.status(500).send({'message':'Failed to fetch the details'});
    }
});

router.get('/userProfiles',authenticateToken,async(request,response)=>{
    try{
        const {email} = request;
    const profileData= await profile.find();
    response.status(200).send({"UserDetails":profileData});
    }
    catch(error){
        response.status(500).send({'message':'Failed to fetch the details'});
    }
});

router.post('/submit-enquire',authenticateToken,upload.single("admitCard"),async(request,response)=>{
   try{
    const {email,id}=request
    const {name,whatsappNumber,address,city,serviceType,busStop,exam,examCity,examCenter,examDate,requestStatus}= request.body
    const inputDate = new Date(examDate);
    const difference = differenceInDays(inputDate,new Date());
    const admitCard = await imageUploder.uploadFile(request.file.path);
    const userId = id;
    if(difference > 4){
    const existing = await enquire.findOne({email});
    const data = {name,whatsappNumber,address,city,serviceType,busStop,exam,examCity,examCenter,examDate,admitCard,requestStatus,email,userId};
    if(existing === null){
     const query = new enquire(data);
     await query.save();
    }else{
        await enquire.findOneAndUpdate({email},{data});
    }
     response.status(200).send({"message":"Form submited successfully"})
    }else{
        response.status(400).send({"message":"Apologies, We need your request atleast 4 days before your exam"})
    }
   }catch(error){
    console.log(error);
    response.status(400).send({"message":"Failed to add the data"});
   }
})

router.post('/name', authenticateToken,upload.single('imageUrl'), async(request,response)=>{
    const email = request.email
    const {name} = request.body;
    const existing = await Name.findOne({name});
    const imageUrl=await imageUploder.uploadFile(request.file.path);
    if(existing){
      response.send('user already exists');
    }
    else{
      const newName = new Name({email,name,imageUrl});
      await newName.save();
      response.send('name added');
    }
  });

module.exports = router; 