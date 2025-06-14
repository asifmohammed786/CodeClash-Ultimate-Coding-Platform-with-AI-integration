import express from 'express'
import { 
  isAuthenticated, login, logout, register, 
  resetPassword, sendResetOtp, sendVerifyOtp, 
  verifyEmail, googleLogin 
} from '../controllers/authController.js';
import userAuth from '../middleware/userAuth.js';
import transporter from '../config/nodemailer.js';

const authRouter = express.Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', logout);
authRouter.post('/send-verify-otp', userAuth, sendVerifyOtp);
authRouter.post('/verify-account', userAuth, verifyEmail);
authRouter.get('/is-auth', userAuth, isAuthenticated);
authRouter.post('/send-reset-otp', sendResetOtp);
authRouter.post('/reset-password', resetPassword);

// Google OAuth route
authRouter.post('/google', googleLogin);
authRouter.get('/test-email', async (req, res) => {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: 'your@email.com',
      subject: 'Test Email',
      text: 'This is a test email from CodeClash using Brevo SMTP.'
    });
    res.json({ success: true, message: 'Test email sent!' });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
});

export default authRouter;
