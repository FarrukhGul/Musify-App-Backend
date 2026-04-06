const mongoose = require('mongoose')


async function connectDB() {
    try{
        await mongoose.connect(process.env.MONGODB_URI)
        console.log(("Mongo DB is connected Successfully..."));
    }
    catch(err){
        console.log("DB Connection Error...", err);
        
    }
}

module.exports = connectDB