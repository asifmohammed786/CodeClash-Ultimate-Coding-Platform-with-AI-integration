import express from "express";
import userAuth from "../middleware/userAuth.js";
import { getUserData, getProfile } from "../controllers/userController.js";
import { editProfile } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.put('/edit', userAuth, editProfile);


userRouter.get('/data', userAuth, getUserData);
userRouter.get('/profile', userAuth, getProfile);
userRouter.get('/leaderboard', async (req, res) => {
  try {
    const users = await userModel.aggregate([
      {
        $addFields: {
          totalSolved: { $add: ["$problemsSolved.easy", "$problemsSolved.medium", "$problemsSolved.hard"] }
        }
      },
      { $sort: { totalSolved: -1 } },
      { $limit: 50 },
      {
        $project: {
          name: 1,
          totalSolved: 1,
          problemsSolved: 1,
          createdAt: 1
        }
      }
    ]);

    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default userRouter;
