import userModel from "../models/user.js";

const adminAuth = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.userId);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ 
        success: false, 
        message: "Admin access required" 
      });
    }
    next();
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

export default adminAuth;
