const express = require('express');
const mongoose = require('mongoose');
const morgan = require("morgan");
const cors = require("cors");
const nodemailer = require('nodemailer');
const jwt = require("jsonwebtoken");
const authentication = require("./middleware/authentication");
require('dotenv').config();

const app=express();
app.use(morgan("dev"))
app.use(cors())
app.use(express.json())

const port = 3000

//nodemailer transport 
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD
  }
});


mongoose
  .connect(
    process.env.MONGODB_URI)
  .then(() => {
    app.listen(port, () => {
      console.log(`MongoDB connected`)
      console.log(`Server is running on port ${port}`)
    })
  })
  .catch((err) => console.log(err));

//collections
const Name = require('./Models/test');
const User =require('./Models/user');
const LogginUsers = require('./Models/logginUsers');

//Routes
app.post('/name', async(request,response)=>{
  const {name} = request.body;
  const existing = await Name.findOne({name})
  if(existing){
    response.send('user already exists');
  }
  else{
    const newName = new Name({name});
    await newName.save();
    response.send('name added');
  }
});

app.get('/',async(request,response)=>{
  const data = await Name.find();
  response.send({data});
});

app.post('/sendOTP', async (req, res) => {
  const { email } = req.body;
  try {
    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    // Save user email and OTP to the database
    await User.findOneAndUpdate({ email }, { otp:otp, createdAt: Date.now() }, { upsert: true });

    // Send OTP email
    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: email,
      subject: 'OTP Verification',
      text: `Your OTP is: ${otp}`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);

    res.status(200).send({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).send({ message: 'Error sending OTP' });
  }
});

app.post('/verifyOtp',async(request,response)=>{
   const {email,otp} = request.body
   const currentTime = Date.now()
   const expiryDate = currentTime - (1*60*1000)
   const payload = {
    "email" :email
   };
   const token = jwt.sign(payload, "jwt_secret");
   const existing = await User.findOne({email});
   if(!existing){
    response.status(400).send({"message":"User Doesn't exist"});
    return;
   }
   const condition = await User.findOne({email,otp,createdAt : {$gt : expiryDate}});
   console.log(condition);
   if(condition==null){
    response.status(400).send({"message":"Invalid OTP or Time Expired"});
    return;
   }
   const loginUsers = await LogginUsers.findOne({email});
   if(!loginUsers && condition) {
     const uploadUser = new LogginUsers({email})
     await uploadUser.save();
    }
   response.status(200).send({"message":"Logged in succefully", "token" : token});
})

app.get('/get',authentication,async(req,res)=>{
  const {id,email}= req;
  console.log(id,email);
  res.send('called');
})

//router
const profileDetails = require('./routes/profileDetails');
const home = require('./routes/home');

app.use('/api', profileDetails);
app.use('/home',home);