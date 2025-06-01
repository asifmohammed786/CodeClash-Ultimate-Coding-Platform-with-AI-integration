import Problem from "../models/problem.js";

// Create problem (Admin only)
export const createProblem = async (req, res) => {
  try {
    const { title, description, difficulty, testCases } = req.body;
    const problem = await Problem.create({
      title,
      description,
      difficulty,
      testCases,
      createdBy: req.userId
    });
    res.status(201).json({ success: true, problem });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get all problems (Public)
export const getAllProblems = async (req, res) => {
  try {
    const problems = await Problem.find()
      .select('title difficulty createdAt')
      .sort({ createdAt: -1 });
    res.json({ success: true, problems });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single problem (Public)
export const getProblem = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    if (!problem) {
      return res.status(404).json({ 
        success: false, 
        message: "Problem not found" 
      });
    }
    res.json({ success: true, problem });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update problem (Admin only)
export const updateProblem = async (req, res) => {
  try {
    const problem = await Problem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json({ success: true, problem });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete problem (Admin only)
export const deleteProblem = async (req, res) => {
  try {
    await Problem.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Problem deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
