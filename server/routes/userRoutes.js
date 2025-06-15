import express from "express";
import userAuth from "../middleware/userAuth.js";
import {
  getUserData,
  getProfile,
  editProfile,
  getLeaderboard
} from "../controllers/userController.js";

const userRouter = express.Router();

// 🛠 Edit user profile
userRouter.put('/edit', userAuth, editProfile);

// 📦 Get user data (basic, post-login)
userRouter.get('/data', userAuth, getUserData);

// 📂 Get profile info (full data for profile page)
userRouter.get('/profile', userAuth, getProfile);

// 🏆 Leaderboard route (public or with auth, your choice)
userRouter.get('/leaderboard', getLeaderboard);

export default userRouter;
