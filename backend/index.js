import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/connectDB.js";
import router from "./routes/authRoute.js";
import songRouter from "./routes/songRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  })
);

// Database connection
connectDB();

// API Routes
app.use("/api/auth", router);
app.use("/api/songs", songRouter);

// Root Route (for health checks/deployment)
app.get("/", (req, res) => {
  res.status(200).json({ message: "Music Player Backend is running smoothly." });
});

app.listen(PORT, () => console.log(`Server is running on Port ${PORT}`));
