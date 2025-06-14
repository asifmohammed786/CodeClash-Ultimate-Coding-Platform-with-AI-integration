import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import userModel from '../models/user.js';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLogin = async (req, res) => {
    try {
        const { credential } = req.body;
        
        // Verify Google token
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        
        const { email, name, picture } = ticket.getPayload();

        // Find or create user
        let user = await userModel.findOne({ email });
        
        if (!user) {
            user = await userModel.create({
                name,
                email,
                avatar: picture,
                isAccountVerified: true,
                authMethod: 'google'
            });
        }

        // Generate JWT
        const token = jwt.sign(
            { id: user._id }, 
            process.env.JWT_SECRET, 
            { expiresIn: '7d' }
        );

        // Set cookie and respond
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.json({ 
            success: true, 
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                isAdmin: user.isAdmin
            }
        });

    } catch (error) {
        console.error('Google Auth Error:', error);
        res.status(400).json({
            success: false,
            message: error.message || 'Google authentication failed'
        });
    }
};
