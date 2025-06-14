import express from "express";
import contestModel from "../models/contest.js";
import userAuth from "../middleware/userAuth.js";
import adminAuth from "../middleware/adminAuth.js";


const router = express.Router();

// Get all contests (upcoming and past)
router.get("/", async (req, res) => {
  const contests = await contestModel.find().sort({ startTime: -1 });
  res.json(contests);
});

// Register for a contest
router.post("/:id/register", userAuth, async (req, res) => {
  const contest = await contestModel.findById(req.params.id);
  if (!contest) return res.status(404).json({ error: "Contest not found" });
  if (!contest.registeredUsers.includes(req.userId)) {
    contest.registeredUsers.push(req.userId);
    await contest.save();
  }
  res.json({ success: true });
});

// Create a contest (admin only)
router.post("/", userAuth, async (req, res) => {
  // Optionally check if user is admin
  const { name, description, startTime, endTime, problems } = req.body;
  const contest = await contestModel.create({
    name, description, startTime, endTime, problems, creator: req.userId
  });
  res.json(contest);
});

// In routes/contest.js
router.get("/:id", async (req, res) => {
  try {
    const contest = await contestModel.findById(req.params.id);
    if (!contest) return res.status(404).json({ error: "Contest not found" });
    res.json(contest);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a contest (admin only)
router.delete("/:id", userAuth, adminAuth, async (req, res) => {
  try {
    const contest = await contestModel.findByIdAndDelete(req.params.id);
    if (!contest) return res.status(404).json({ error: "Contest not found" });
    res.json({ success: true, message: "Contest deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


export default router;
