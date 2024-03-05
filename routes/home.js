const mongoose =require('mongoose');
const express = require('express');
const multer = require('multer');


const router = express();
router.use(express.json());

//collections
const banner = require('../Models/banner')
const service = require('../Models/service');
const services = require('../Models/services');

//middleware
const imageUploder = require('../helpers/upload');
const authenticateToken = require("../middleware/authentication");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/homePics') // Store uploaded files in the 'uploads' directory
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
  });
  
const upload = multer({ storage: storage });

router.put('/banner', upload.single('imageUrl'),authenticateToken,async(request,response)=>{
    if (request.file==undefined) {
        return response.status(400).send({ message: 'No file found' });
    }
  
  try { 
    const bannerUrl = await imageUploder.uploadFile(request.file.path);
   await banner.findOneAndUpdate({},{bannerUrl:bannerUrl});
   response.status(200).send({"message":"Banner updated"});
  }catch(error){
    response.send({error});
  }
})

router.put('/service', authenticateToken, async(request,response)=>{
    try{
        const {heading,description}=request.body
        await service.findOneAndUpdate({}, {heading:heading,description:description});
        response.status(200).send({"message" : "Data updated"});
   }catch(error){
    response.status(500).send({"message":error});
   }
})

router.post('/services', upload.single('imageUrl'),authenticateToken,async(request,response)=>{
    const serviceUrl = await imageUploder.uploadFile(request.file.path);
    try { 
        
     const data = new services({serviceUrl});
     await data.save();
     response.status(200).send({"message":"service added"})
    }catch(error){
      response.send({error});
    }
  })

router.put('/services/:id',upload.single('imageUrl'), authenticateToken, async(request,response)=>{
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

module.exports =router