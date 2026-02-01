import express, { response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/connectDB.js";
import router from "./routes/authRoute.js";
import songRouter from "./routes/songRoutes.js";
dotenv.config(".env");
const PORT = process.env.PORT || 5001;


const app=express();
app.use(express.json());

connectDB();

app.use(cors(
    {
        origin:"http://localhost:5173",
        credentials:true,
    }
))

// app.get("/",(req,res)=>{
//     res.status(200).json({message:"Server is working."});
// });//Business logic are written here


app.use("/api/auth", router);
app.use("/api/songs",songRouter)

app.listen(PORT, ()=>console.log(`Server is running on Port ${PORT}`));
