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
const requests = require('../Models/requests');

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

router.get('/history',authenticateToken,async(request,response)=>{
    try { 
        const fetch = await requests.find({requestStatus:"Approved"});
        response.status(200).send({"Enquire":fetch});
    }catch(error){
        response.status(400).send({"message":"Failed to Fetch the data"});
    }
    })
router.get('/user-history',authenticateToken,async(request,response)=>{
    const {email}=request
    try{
        const data = await requests.findOne({email});
        response.status(200).send({"Enquire":data});
    }catch(error){
        response.status(400).send({"message":"Failed to push the data"})
    }
})

router.get('/user-history/:id',authenticateToken,async(request,response)=>{
    const {id}=request.params
    try{
        const data = await requests.findOne({_id:id});
        response.status(200).send({"Enquire":data});
    }catch(error){
        response.status(400).send({"message":"Failed to push the data"})
    }
})


router.put('/submit-enquire/:id',authenticateToken,adminVerification,async(request,response)=>{
  const {id} = request.params
  const {requestStatus,message} = request.body
  console.log(id , requestStatus);
  try{
    await requests.findOneAndUpdate({_id:id},{requestStatus});
    const fetch = await requests.findOne({_id:id},{email:1});
    const email= fetch.email;
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
    const {email,id} = request
    console.log(request.body)
    const {name,exam,city,examCenter,examCity,whatsappNumber} = request.body;
    const existing = await Name.findOne({name});
    const imageUrl=await imageUploder.uploadFile(request.file.path);
    if(existing){
      response.send('user already exists');
    }
    else{
      const userId = id;  
      const newName = new Name({userId,email,name,imageUrl,exam,whatsappNumber,city,examCenter,examCity});
      await newName.save();
      response.send('name added');
    }
  });

  router.get('/name',async(request,response)=>{
    const data = await Name.find();
    response.send({data})
  })

router.post('/submit-enquire', authenticateToken, upload.single('admitCard'), async(request,response)=>{
    try{
    const {email,id} = request
    console.log(request.body)
   
    const { name,
        whatsappNumber ,
        address ,
        city ,
        busStop,
        serviceType,
    exam,
    examDate,
    examCity,
    examCenter
    
    } = request.body;
    const inputDate = new Date(examDate);
    const diff = differenceInDays(inputDate, new Date());
    if(diff < 4){
        return response.status(400).send({"message" : "Apologies! We need your request before 4 days."});
    }
    const admitCard=await imageUploder.uploadFile(request.file.path);
      const userId = id;  
      const newName = new requests({userId,email,name,
        whatsappNumber ,
        address ,
        city ,
        busStop,admitCard,serviceType,
        exam,
        examDate,
        examCity,
        examCenter});
      await newName.save();
      response.status(200).send({"message":'name added'});

}catch(error){
    console.log(error);
    response.status(400).send({"message":"Error Submitting the Request"});
}
  });  

  router.put('/request/:id',authenticateToken, upload.single('admitCard'), async(request,response)=>{
    try{
        const {id} = request.params;
    const data = await requests.findOne({_id:id});
    if(data===null){
      return response.status(400).send({"message":"Id dosen't exist's in the collection."});
    } 
    const { name,
        whatsappNumber ,
        address ,
        city ,
        busStop,
        serviceType,
    exam,
    examDate,
    examCity,
    examCenter
    
    } = request.body;
    const inputDate = new Date(examDate);
    const diff = differenceInDays(inputDate, new Date());
    if(diff < 4){
        return response.status(400).send({"message" : "Apologies! We need your request before 4 days."});
    }
    const admitCard=await imageUploder.uploadFile(request.file.path);
    const updatedData = { name,
        whatsappNumber ,
        address ,
        city ,
        busStop,
        serviceType,
    exam,
    examDate,
    examCity,
    examCenter,admitCard}
    await requests.findOneAndUpdate({_id:id},updatedData);
    response.status(200).send({"message":"Your request updated"});
    }catch(error){
        console.log(error);
        response.status(400).send({"message":"Failed to update your request"});
    }
  })

  router.delete('/request/:id',authenticateToken,async(request,response)=>{
  try{
    const {id} = request.params
    await requests.deleteOne({_id:id});
    response.status(200).send({"message":"Successfully Deleted"});
  }catch(error){
    response.status(400),send({"message":"Failed to delete."});
  }
  })
  router.get('/booking-history',async(request,response)=>{
    const data = await requests.find({requestStatus:"Pending"});
    response.send({data})
  })  
  

module.exports = router; 