import 'dotenv/config'
import express from "express"
import cors from 'cors'
import connectDB from "./config/mongodb.js"
import connectCloudinary from "./config/cloudinary.js"
import userRouter from "./routes/userRoute.js"
import doctorRouter from "./routes/doctorRoute.js"
import adminRouter from "./routes/adminRoute.js"

// app config
const app = express()
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()

// middlewares
app.use(express.json())

// --- UPDATE STARTS HERE ---
const allowedOrigins = [
  'https://vercel.com/learning-lads-projects/dental-system/EbRtSKp1BMwcobFcKCLPRfcKdM9G', 
  'https://dental-system-4qdbyzkot-learning-lads-projects.vercel.app/'      
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or server-to-server)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));


// api endpoints
app.use("/api/user", userRouter)
app.use("/api/admin", adminRouter)
app.use("/api/doctor", doctorRouter)

app.get("/", (req, res) => {
  res.send("API Working")
});

app.listen(port, () => console.log(`Server started on PORT:${port}`))