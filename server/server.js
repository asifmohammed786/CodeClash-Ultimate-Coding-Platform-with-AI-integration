import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from './config/mongodb.js';
import nodemailer from "nodemailer";

// Routers
import authRouter from './routes/authRoutes.js';
import userRouter from "./routes/userRoutes.js";
import problemRouter from "./routes/problemRoutes.js";
import compilerRoutes from './routes/compilerRoutes.js';
import aiRoutes from './routes/ai.js';
import contestRouter from './routes/contest.js';

// Load .env variables
dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

// === ✅ Connect to MongoDB ===
connectDB();

// === ✅ Brevo SMTP Transporter ===
export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // Brevo uses STARTTLS
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// === ✅ CORS Configuration ===
const allowedOrigins = [
  'https://codeclashes.com',
  'https://www.codeclashes.com',
  'http://localhost:3000'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
}));

// === ✅ Middlewares ===
app.use(express.json());
app.use(cookieParser());

// === ✅ Health check route ===
app.get("/", (req, res) => res.send("✅ API is working!"));

// === ✅ API Routes ===
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/problems', problemRouter);
app.use('/api/compiler', compilerRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/contests', contestRouter);

// === ✅ Start server ===
app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Server started on port: ${port}`);
});

export default app;
