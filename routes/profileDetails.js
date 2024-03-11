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
const notifications = require('../Models/notifications');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/') // Store uploaded files in the 'uploads' directory
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
  });

  //middlewares
const upload = multer({ storage: storage });
const imageUploder = require("../helpers/upload");
const adminVerification = require('../middleware/adminVerification');

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
    const {name,whatsappNumber,address,city,serviceType,busStop,exam,examCity,examCenter,examDate} = request.body
    console.log(name,whatsappNumber,address,city,serviceType,busStop,exam,examCity,examCenter,examDate)
    const inputDate = new Date(examDate);
    const difference = differenceInDays(inputDate,new Date());
    if(!request.file){
       return response.status(400).send({"message":"File does not exists"});
    }
    const admitCard = await imageUploder.uploadFile(request.file.path);
    const userId = id;
    if(difference > 4){
    const existing = await enquire.findOne({email});
    const data = {name,whatsappNumber,address,city,serviceType,busStop,exam,examCity,examCenter,examDate,admitCard,email,userId};
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
router.get('/user-enquire',authenticateToken,async(request,response)=>{
const {email} = request;
try { 
    const fetch = await enquire.findOne({email});
    response.status(200).send({"Enquire":fetch});
}catch(error){
    response.status(400).send({"message":"Failed to Fetch the data"});
}
})
router.get('/booking-history',authenticateToken,async(request,response)=>{
    try { 
        const fetch = await enquire.find({requestStatus:"Pending"});
        response.status(200).send({"Enquire":fetch});
    }catch(error){
        response.status(400).send({"message":"Failed to Fetch the data"});
    }
    })
router.get('/history',authenticateToken,async(request,response)=>{
    try { 
        const fetch = await enquire.find({requestStatus:"Approved"});
        response.status(200).send({"Enquire":fetch});
    }catch(error){
        response.status(400).send({"message":"Failed to Fetch the data"});
    }
    })
router.get('/user-history',authenticateToken,async(request,response)=>{
    const {email}=request
    try{
        const data = await enquire.findOne({email});
        response.status(200).send({"Enquire":data});
    }catch(error){
        response.status(400).send({"message":"Failed to push the data"})
    }
})

router.put('/submit-enquire/:id',authenticateToken,adminVerification,async(request,response)=>{
  const {id} = request.params
  const {requestStatus} = request.body
  console.log(id , requestStatus);
  try{
    await enquire.findOneAndUpdate({_id:id},{requestStatus});
    let message = '';
    const fetch = await enquire.findOne({_id:id},{email:1});
    const email= fetch.email;
    
    if(requestStatus==="Approved"){
        message = "Your Request Accepted";
    }else{
        message = "Sorry, Your Request Rejected";
    }
    const notification=new notifications({message,email});
    await notification.save();
    response.status(200).send({"message":"Status Updated"});
  }catch(error){
    console.log(error);
    response.status(400).send({"message":"Something went wrong"});
  }


});

router.get('/notifications' , authenticateToken , async(request,response)=>{
  try{
    const data = await notifications.find();
    response.status(200).send({"Notification" : data});
  }catch(error){
    response.status(400).send({"message":"Failed to fetch"});
  }
});

router.post('/name', authenticateToken, upload.single('imageUrl'), async(request,response)=>{
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