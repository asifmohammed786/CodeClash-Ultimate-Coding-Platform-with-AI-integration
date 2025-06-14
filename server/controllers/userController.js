import userModel from "../models/user.js";

export const getUserData = async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ 
                success: false, 
                message: 'Authentication required' 
            });
        }

        const user = await userModel.findById(userId)
            .select('_id name email isAccountVerified isAdmin')
            .lean();

        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }

        return res.json({
            success: true,
            userData: {
                userId: user._id,
                name: user.name,
                email: user.email,
                isAccountVerified: user.isAccountVerified,
                isAdmin: user.isAdmin
            }
        });

    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

export const getProfile = async (req, res) => {
  try {
    const user = await userModel.findById(req.userId)
      .select('-password -verifyOtp -resetOtp -__v')
      .populate({
        path: 'submissions',
        options: { sort: { timestamp: -1 }, limit: 5 },
        select: 'problem verdict timestamp',
        populate: { path: 'problem', select: 'title' }
      });

    if (!user) return res.status(404).json({ error: "User not found" });

    // Safe defaults for stats
    const stats = {
      totalSolved: (user.problemsSolved?.easy || 0) + 
                   (user.problemsSolved?.medium || 0) + 
                   (user.problemsSolved?.hard || 0),
      easy: user.problemsSolved?.easy || 0,
      medium: user.problemsSolved?.medium || 0,
      hard: user.problemsSolved?.hard || 0
    };

    res.json({
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      stats,
      activity: user.submissionCalendar || {},
      languages: user.languagesUsed || [],
      recentSubmissions: user.submissions || []
    });
  } catch (err) {
    console.error('Profile error:', err);
    res.status(500).json({ error: 'Failed to load profile data' });
  }
};

export const editProfile = async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.userId;
    await userModel.findByIdAndUpdate(userId, { name });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

