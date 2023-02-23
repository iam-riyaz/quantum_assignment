
const jwt = require("jsonwebtoken")

const tokenVerifier= async (req,res, next)=>{
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(400).send("token not provided by Client");
    }
  
    if (!process.env.SECRET_KEY) {
      return new Error("secret key not provided by Database");
    }
    try {
      const myconst=await jwt.verify(token, process.env.SECRET_KEY);
      console.log("myconst", myconst);
    
      next();
    } catch (err) {
      return res.status(400).send("User is not authenticated please login first");
    }

}

module.exports = tokenVerifier