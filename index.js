const express = require('express');
const mongoose = require('mongoose');
const morgan = require("morgan")
const cors = require("cors")
require('dotenv').config();

const app=express();
app.use(morgan("dev"))
app.use(cors())
app.use(express.json())

const port = 3000



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


const Name = require('./Models/test');

app.post('/name', async(request,response)=>{
  const {name} = request.body;
  const post = new Name({
   name
  });
  await post.save();
  response.send("done");
});

app.get('/',async(request,response)=>{
  const data = await Name.find();
  response.send({data});
})