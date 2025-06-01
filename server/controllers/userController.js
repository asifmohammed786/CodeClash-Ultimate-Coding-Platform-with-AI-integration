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
            .select('_id name email isAccountVerified isAdmin') // <-- Added isAdmin here
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
                isAdmin: user.isAdmin           // <-- Added isAdmin here
            }
        });

    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};
