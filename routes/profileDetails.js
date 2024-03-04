const express = require('express');
const multer = require('multer');
const path = require('path');
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

router.post('/submit-enquire',authenticateToken,upload.single('admitCard'),async (request,response)=>{
    const { name, whatsappNumber, address, examCity, examCenter,exam,busStop } = request.body;
    const {email,id} = request;
    try {
        const user_id = id;
        const imageUrl=await imageUploder.uploadFile(request.file.path);
        const existing = await enquire.findOne({ email });
        console.log(existing);
        const data = {
            name,
            whatsapp_number: whatsappNumber,
            address,
            exam_city :examCity,
            exam_center : examCenter,
            bus_stop:busStop,
            email,
            user_id,
            exam,
            admit_card_path: imageUrl
        };

        if (!existing) {
            const insertDetails = new enquire(data);
            await insertDetails.save();
            response.status(200).send({ "message": "enquire Details added" });
        } else {
            await enquire.findOneAndUpdate({ email }, data);
            response.status(200).send({ "message": "enquire updated Successfully" });
        }
    } catch (err) {
        console.log(err);
        response.status(400).send({ "message": "Failed to push the data" });
    }
});
router.post('/name', upload.single('imageUrl'), async(request,response)=>{
    const {name} = request.body;
    const existing = await Name.findOne({name});
    const imageUrl=await imageUploder.uploadFile(request.file.path);
    if(existing){
      response.send('user already exists');
    }
    else{
      const newName = new Name({name,imageUrl});
      await newName.save();
      response.send('name added');
    }
  });

module.exports = router; 