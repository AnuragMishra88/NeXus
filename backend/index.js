import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import notesRoute from "./routes/notes.route.js";


import path from "path";
dotenv.config({});

const app = express();
const __dirname = path.resolve();
// middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
const corsOptions = {
    origin: "http://localhost:5173", // CHANGED THIS
    credentials: true
}

app.use(cors(corsOptions));

const PORT = process.env.PORT || 8000; // CHANGED THIS


// api's
app.use("/api/v1/user", userRoute);
app.use("/api/v1/notes", notesRoute); // Add this line


// app.use(express.static(path.join(__dirname,"/frontend/dist")))
// app.get('*',(_,res)=>{
//     res.sendFile(path.resolve(__dirname,"frontend","dist","index.html"));
// })

app.listen(PORT,()=>{
    connectDB();
console.log(`Server running at http://localhost:${PORT}`);
})