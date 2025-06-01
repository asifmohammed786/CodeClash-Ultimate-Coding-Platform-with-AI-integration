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

const router = express.Router();

// Public routes
router.get("/", getAllProblems);
router.get("/:id", getProblem);

// Admin routes
router.post("/", userAuth, adminAuth, createProblem);
router.patch("/:id", userAuth, adminAuth, updateProblem);
router.delete("/:id", userAuth, adminAuth, deleteProblem);

export default router;
