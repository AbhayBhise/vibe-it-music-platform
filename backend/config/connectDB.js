import mongoose from "mongoose";
import dotenv from "dotenv";


dotenv.config({path: "../.env"});

const connectDB= async ()=>{

    try{
        const connection = await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB connection was sucessfull.");

    }
    catch(error){
        console.log("Failed to connect MongoDB with Error: ", error.message);
    }
};


export default connectDB;