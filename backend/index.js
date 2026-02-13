import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import notesRoute from "./routes/notes.route.js";
import resumeRoutes from "./routes/resume.route.js";
import quizroutes from "./routes/quiz.route.js";
import careerRoadmapRoutes from "./routes/careerRoadmap.route.js";
import { ClerkExpressWithAuth } from "@clerk/clerk-sdk-node";
import path from "path";

dotenv.config({});

const app = express();
const __dirname = path.resolve();
app.disable("etag");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};

app.use(cors(corsOptions));

// Clerk Authentication Middleware
app.use(ClerkExpressWithAuth());

const PORT = process.env.PORT || 8000;

// API Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/notes", notesRoute);
app.use("/api/v1/user/resume", resumeRoutes);
app.use("/api/v1/quiz", quizroutes);
app.use("/api/v1/career/roadmap", careerRoadmapRoutes);

// Optional static serving (kept commented as before)
// app.use(express.static(path.join(__dirname,"/frontend/dist")))
// app.get('*',(_,res)=>{
//     res.sendFile(path.resolve(__dirname,"frontend","dist","index.html"));
// })

app.listen(PORT, () => {
  connectDB();
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`📝 Quiz Bank API available at http://localhost:${PORT}/api/v1/quiz`);
});
