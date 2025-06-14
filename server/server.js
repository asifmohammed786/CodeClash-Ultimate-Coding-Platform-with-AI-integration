import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from './config/mongodb.js';

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
const port = process.env.port || 4000;

// Connect to MongoDB
connectDB();

// === ✅ CORS Configuration ===
app.use(cors({
  origin: ["https://codeclashes.com", "https://api.codeclashes.com"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
}));

// Middleware
app.use(express.json());
app.use(cookieParser());

// Test route
app.get("/", (req, res) => res.send("API working ✅"));

// Routes
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/problems', problemRouter);
app.use('/api/compiler', compilerRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/contests', contestRouter);

// Start server
app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Server started on port: ${port}`);
});

export default app;
