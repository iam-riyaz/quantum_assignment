const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

 const connectDb = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI ||"" );

    console.log(`MongoDB Connected...`+conn.connection.host);
  } catch(err) {

    console.error(`Error: ${err.message}`);
    process.exit(); 
    
  }
};

module.exports=connectDb
