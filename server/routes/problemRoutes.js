import express from "express";
import { 
  createProblem,
  getAllProblems,
  getProblem,
  updateProblem,
  deleteProblem
} from "../controllers/problemController.js";
import userAuth from "../middleware/userAuth.js";
import adminAuth from "../middleware/adminAuth.js";
import Problem from "../models/problem.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    if (req.query.ids) {
      const ids = req.query.ids.split(",");
      const problems = await Problem.find({ _id: { $in: ids } });
      const idOrder = ids.reduce((a, id, i) => (a[id] = i, a), {});
      problems.sort((a, b) => idOrder[a._id.toString()] - idOrder[b._id.toString()]);
      return res.json({ problems });
    }
    return getAllProblems(req, res);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// FIXED: Use :problemId as param name
router.get("/:problemId", getProblem);

router.post("/", userAuth, adminAuth, createProblem);
router.patch("/:problemId", userAuth, adminAuth, updateProblem);
router.delete("/:problemId", userAuth, adminAuth, deleteProblem);

export default router;
