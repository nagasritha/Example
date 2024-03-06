const mongoose =require('mongoose');
const express = require('express');
const multer = require('multer');


const router = express();
router.use(express.json());

//collections
const home = require('../Models/home');
const services = require('../Models/services');
const examCity = require('../Models/examCity');
const faqs = require('../Models/faqs');
const card = require('../Models/cards');
const admin = require('../Models/admin');

//middleware
const imageUploder = require('../helpers/upload');
const authenticateToken = require("../middleware/authentication");
const adminAuthentication = require('../middleware/adminVerification');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, 'uploads/homePics'); // Store uploaded files in the 'uploads' directory
  },
  filename: function (req, file, cb) {
      cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

router.put('/home',authenticateToken,adminAuthentication,upload.fields([{ name: 'bannerUrl', maxCount: 1 }, { name: 'backgroundUrlSm', maxCount: 1 },{ name: 'backgroundUrlLg', maxCount: 1 }]), authenticateToken, async (request, response) => {
  if (!request.files || !request.files['bannerUrl'] || !request.files['backgroundUrlSm'] || !request.files['backgroundUrlLg']) {
      return response.status(400).send({ message: 'No file found' });
  }

  try { 
      console.log(request.files['bannerUrl'][0].path);
      console.log(request.files['backgroundUrlSm'][0].path);
      const bannerUrl = await imageUploder.uploadFile(request.files['bannerUrl'][0].path);
      const backgroundUrlSm = await imageUploder.uploadFile(request.files['backgroundUrlSm'][0].path);
      const backgroundUrlLg = await imageUploder.uploadFile(request.files['backgroundUrlLg'][0].path);
      const {backgroundText, serviceHeading , serviceDescription, examHeading, examDescription ,acoFeautureHeading,acoFeautureDescription,travelFeautureHeading,travelFeautureDescription, faqHeading, faqDescription} = request.body
      console.log(backgroundText, serviceHeading , serviceDescription, examHeading, examDescription ,acoFeautureHeading,acoFeautureDescription,travelFeautureHeading,travelFeautureDescription, faqHeading, faqDescription);
      // Assuming you have a schema named 'Banner'
      // Update a specific document in the 'banner' collection
      await home.findOneAndUpdate({_id:'65e7fe7d601cb968229d6afd'},{ bannerUrl:bannerUrl,
                          backgroundUrlSm:backgroundUrlSm,
                          backgroundUrlLg:backgroundUrlLg,
                          backgroundText:backgroundText,
                          serviceHeading: serviceHeading ,
                          serviceDescription: serviceDescription,
                          examHeading: examHeading,
                          examDescription: examDescription ,
                          acoFeautureHeading:acoFeautureHeading,
                          acoFeautureDescription : acoFeautureDescription,
                          travelFeautureHeading : travelFeautureHeading,
                          travelFeautureDescription : travelFeautureDescription,
                          faqHeading : faqHeading, 
                          faqDescription : faqDescription});
      response.status(200).send({ "message": "home updated" });
  } catch (error) {
      console.error(error);
      response.status(500).send({ error });
  }
});

router.get('/home',async(request,response)=>{
try{
  const data = await home.findOne({_id:'65e7fe7d601cb968229d6afd'})
  response.send({"homeData" : data}).status(200);
}catch(error){
  response.status(400).send({"message":"Error Fetching the data"});
}
})

router.post('/services', upload.single('imageUrl'),authenticateToken,adminAuthentication,async(request,response)=>{
    const serviceUrl = await imageUploder.uploadFile(request.file.path);
    const {name} = request.body
    try { 
        
     const data = new services({serviceUrl,name});
     await data.save();
     response.status(200).send({"message":"service added"})
    }catch(error){
      response.send({error});
    }
  })

router.put('/services/:id',upload.single('imageUrl'), authenticateToken,adminAuthentication, async(request,response)=>{
    try{
        const serviceUrl = await imageUploder.uploadFile(request.file.path);
        const {id} = request.params
        console.log(id);
        const data = await services.findOneAndUpdate({_id:id},{serviceUrl : serviceUrl});
        console.log(data);
    response.send({"message":"Service Updated"});
    }catch(error){
        response.status(500).send({"message" : error});
    }
})

router.delete(('/services/:id'),authenticateToken,adminAuthentication, async(request,response)=>{
  try{
      const {id} = request.params
      await services.findOneAndDelete({_id:id});
  response.send({"message":"Service Deleted"});
  }catch(error){
      response.status(500).send({"message" : "Failed to delete data"});
  }
})

router.get('/services' , async(request,response)=>{
  try{
    const data = await services.find();
    response.status(200).send({"services" : data})
  }catch(error){
    response.status(400).send({"message":"Error fetching the data"})
  }
})


router.post('/examCity', upload.single('cityUrl'), authenticateToken,adminAuthentication, async(request,response)=>{
  const cityUrl = await imageUploder.uploadFile(request.file.path);
  const {name} = request.body
  try { 
      
   const data = new examCity({cityUrl,name});
   await data.save();
   response.status(200).send({"message":"city added"})
  }catch(error){
    response.send({error});
  }
})

router.put('/examCity/:id',upload.single('cityUrl'), authenticateToken, adminAuthentication,async(request,response)=>{
  try{
      const cityUrl = await imageUploder.uploadFile(request.file.path);
      const {id} = request.params
      const {name} =request.body
      console.log(id);
      await examCity.findOneAndUpdate({_id:id},{cityUrl : cityUrl, name: name});
      response.send({"message":"City Updated"});
  }catch(error){
      response.status(500).send({"message" : "Error fetching the data"});
  }
})

router.delete('/examCity/:id', authenticateToken, adminAuthentication,async(request,response)=>{
  try{
      const {id} = request.params
      await examCity.findOneAndDelete({_id:id});
      response.send({"message":"City deleted"});
  }catch(error){
      response.status(500).send({"message" : "Failed to delete data"});
  }
})

router.get('/examCity' , async(request,response)=>{
try{
  const data = await examCity.find();
  response.status(200).send({"cities" : data})
}catch(error){
  response.status(400).send({"message":"Error fetching the data"})
}
})

router.post('/faq' , authenticateToken , adminAuthentication,async(request,response)=>{
 try{
  const {question,answer} = request.body
  const data = new faqs({
    question,answer
  });
  await data.save();
  response.status(200).send({"message": "Data added"});
 }catch(error){
  response.status(400).send({"message":"Data not added"});
 }
})

router.put('/faq/:id' , authenticateToken ,adminAuthentication,adminAuthentication, async(request,response)=>{
  try{
   const {question,answer} = request.body
   const {id} = request.id
   await faqs.findOneAndUpdate({_id :id},{question : question,
                                                     answer : answer
   });
   response.status(200).send({"message": "Data updated"});
  }catch(error){
   response.status(400).send({"message":"Data not updated"});
  }
 })

 router.delete('/faq/:id' , authenticateToken ,adminAuthentication,adminAuthentication, async(request,response)=>{
  try{
   const {id} = request.id
   await faqs.findOneAndDelete({_id :id});
   response.status(200).send({"message": "Data deleted"});
  }catch(error){
   response.status(400).send({"message":"Failed to delete"});
  }
 })

router.get('/faq',async(request,response)=>{
  try{
    const data = await faqs.find();
    response.status(200).send({"faqs" : data});
  }catch(error){
    response.status(400).send({"message": "Error fetching the data"});
  }
})

router.post('/card',upload.single('logo'), authenticateToken ,adminAuthentication, async(request,response)=>{
 try{
  const {title,description,cardParent}=request.body
  const logo = await imageUploder.uploadFile(request.file.path);
  console.log(cardParent.toUpperCase());
  const data = new card({title,description,logo,cardParent : cardParent.toUpperCase()});
  await data.save();
  response.status(200).send({"message":"Added card details"});
 }catch(error){
  response.status(400).send({"message":"Failed to add the card details"});
 }
})



router.put('/card/:id',upload.single('logo'),authenticateToken, adminAuthentication , async (request,response)=>{
  
  try{
    const {title,description,cardParent}=request.body
    const logo = await imageUploder.uploadFile(request.file.path);
    const {id} = request.id
    await card.findOneAndUpdate({_id : id },{title,description,logo,cardParent : cardParent.toUpperCase()});
    response.status(200).send({"message":"updateded the card details"});
   }catch(error){
    response.status(400).send({"message":"Failed to update the card details"});
   }
  })

router.delete('/card/:id',authenticateToken, adminAuthentication , async (request,response)=>{
  
    try{
      const {id} = request.id
      await card.findOneAndDelete({_id : id });
      response.status(200).send({"message":"Card deleted"});
     }catch(error){
      response.status(400).send({"message":"Failed to delete the card"});
     }
    });

router.get('/card',async(request,response)=>{
  try{
  const {cardType} = request.query
  const data = await card.find({cardParent : cardType});
  response.status(200).send({"CardDetails" : data});
  }catch(error){
    response.status(400).send({"message" : "Failed to fetch the data"});
  }
});

router.post('/admin',authenticateToken,adminAuthentication,async(request,response)=>{
  try{
    const {email}=request.body;
    const data = new admin({
      email
    });
    await data.save();
    response.send({"message" : "Admin added"});
  }catch(error){
    response.send({"message" : "Failed to add admin"});
  }
});


module.exports =router