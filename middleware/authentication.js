const jwt = require("jsonwebtoken");

const logginUsers = require('../Models/logginUsers');

const authenticateToken = (request, response, next) => {
    let jwtToken;
    const authHeader = request.headers["authorization"];
    if (authHeader !== undefined) {
      jwtToken = authHeader.split(" ")[1];
      console.log(jwtToken);
    }
    if (jwtToken === undefined) {
      response.status(401).send({'message':"JWT Token is not provided"});
    } else {
      jwt.verify(jwtToken, "jwt_secret", async (error, payload) => {
        if (error) {
          response.status(401).send({'message':"Invalid JWT Token"});
        } else {
          request.email=payload.email;
          const email = payload.email;
          try{
            const userData = await logginUsers.find({email},{id : "$_id"});
            request.id=userData[0].id;
            next();
          }catch(error){
            console.log(error);
          }
          
        }
      });
    }
  };

module.exports = authenticateToken;