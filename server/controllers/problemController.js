import Problem from "../models/problem.js";
import User from "../models/user.js";

// Create problem (Admin only)
export const createProblem = async (req, res) => {
  try {
    const { title, description, difficulty, testCases } = req.body;

    // Validate test cases
    if (!testCases || !Array.isArray(testCases) || testCases.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one test case is required"
      });
    }

    // Extra admin check (defense-in-depth)
    const user = await User.findById(req.userId);
    if (!user?.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Admin access required"
      });
    }

    const problem = await Problem.create({
      title,
      description,
      difficulty,
      testCases,
      createdBy: req.userId
    });

    res.status(201).json({ success: true, problem });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Get all problems (Public)
export const getAllProblems = async (req, res) => {
  try {
    const problems = await Problem.find()
      .select('title difficulty createdAt createdBy')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });
    res.json({ success: true, problems });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Get single problem (Public) — Secure version
export const getProblem = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.problemId)
      .populate('createdBy', 'name email');

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: "Problem not found"
      });
    }

    const user = await User.findById(req.userId);
    const isAdmin = user?.isAdmin;

    const filteredTestCases = isAdmin
      ? problem.testCases
      : problem.testCases.filter(tc => tc.isSample);

    const response = {
      _id: problem._id,
      title: problem.title,
      description: problem.description,
      difficulty: problem.difficulty,
      createdBy: problem.createdBy,
      createdAt: problem.createdAt,
      testCases: filteredTestCases
    };

    res.json({ success: true, problem: response });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update problem (Admin only)
export const updateProblem = async (req, res) => {
  try {
    // Extra admin check
    const user = await User.findById(req.userId);
    if (!user?.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Admin access required"
      });
    }

    const problem = await Problem.findByIdAndUpdate(
      req.params.problemId,
      req.body,
      { new: true }
    );
    res.json({ success: true, problem });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Delete problem (Admin only)
export const deleteProblem = async (req, res) => {
  try {
    // Extra admin check
    const user = await User.findById(req.userId);
    if (!user?.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Admin access required"
      });
    }

    await Problem.findByIdAndDelete(req.params.problemId);
    res.json({ 
      success: true, 
      message: "Problem deleted" 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};
