import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/connectDB.js";
import router from "./routes/authRoute.js";
import songRouter from "./routes/songRoutes.js";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { errorHandler } from "./middleware/errorHandler.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(helmet());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, 
  legacyHeaders: false, 
});
app.use("/api", limiter);
app.use(
  cors({
    origin: [
      "http://localhost:5173", 
      "http://localhost:5174", 
      "https://vibe-it-music-platform.vercel.app",
      ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : [])
    ],
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

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server is running on Port ${PORT}`));
