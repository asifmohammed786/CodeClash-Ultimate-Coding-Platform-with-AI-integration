import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/user.js";
import transporter from '../config/nodemailer.js'
import { googleLogin } from './googleAuth.js';


//register
export const register = async(req,res ) =>{
    const{ name, email, password } = req.body;
    if(!name || !email || !password){
        return res.json({success: false, message: 'Missing Details'})
    }

    try {
        //checking  existing user
        const existingUser = await userModel.findOne({email})
        if(existingUser){
            return res.json({success: false, message: "User already exists"});
        }
        //hashing password 
        const hashedpassword = await bcrypt.hash(password, 10); 
        const user = new userModel({name, email ,password: hashedpassword});
        await user.save();
        //token generation 
        const token  = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'})
        
        //add token in cookie 
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        //sending email of registering
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Welcome to OJ',
            text: `Welcome to OJ , Your account has been created successfully with email id: ${email}`
        }
        await transporter.sendMail(mailOptions);
        // RETURN TOKEN IN RESPONSE BODY
        return res.json({success: true, token}); // <-- updated line

    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

//login
export const login = async (req,res) => {
    const{email, password } = req.body;
    if (!email || !password) {
        return res.json({success: false, message: 'Email and Password are required'})
    }

    try {
        const user = await userModel.findOne({email});
        if(!user){
            return res.json({success: false, message: 'Invalid Email'})
        }
        //check pass in db
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.json({success: false, message: 'Invalid Password'})
        }

         //token generation 
        const token  = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'})
        
        //add token in cookie 
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        // RETURN TOKEN IN RESPONSE BODY
        return res.json({success: true, token}); // <-- updated line
        
    } catch (error) {
        return res.json({success: false, message: error.message})
    }
}

//logout
export const logout = async (req, res) => {
    try {
        res.clearCookie('token',{
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        })

        return res.json({success: true, message: "Logged Out"})
    } catch (error) {
        return res.json({success: false, message: error.message})

    }
}

//send verification otp to user mail
export const sendVerifyOtp = async (req,res) => {
    try {
        const {userId} = req.body;
        const user = await userModel.findById(userId);
        if (user.isAccountVerified) {
            return res.json({success: false, message: "Account already verified"})
        }
        const otp = String(Math.floor(100000 + Math.random() * 900000))
        user.verifyOtp = otp;
        user.verifyOtpExpireAt = Date.now()+ 24 * 60 * 60 * 1000
        await user.save();
        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Account Verification OTP',
            text: `Your OTP is ${otp}. Verify Your account Using this OTP.`
        }
        await transporter.sendMail(mailOption);
        res.json({success: true, message: "Verification OTP sent on email"});


    } catch (error) {
        res.json({success: false, message: error.message});
    }
}


export const verifyEmail = async (req,res)=>{
    const {userId, otp} = req.body;
    if (!userId || !otp) {
       return  res.json({success: false, message: 'Missing Details'});
    }

    try {
        const user = await userModel.findById(userId);

        if (!user) {
            return res.json({success: false, message: 'User not found'});
        }
        if(user.verifyOtp === ' ' || user.verifyOtp !== otp){
            return res.json({success: false, message: 'Invalid OTP'});
        }
        if (user.verifyOtpExpireAt < Date.now()) {
            return res.json({success:false, message: 'OTP expired'});
        }
        user.isAccountVerified = true;
        user.verifyOtp = ' ';
        user.verifyOtpExpireAt = 0;
        await user.save();
        return res.json({success: true, message: 'Email Verified Successfully'})
        
    } catch (error) {
        res.json({success: false, message: error.message});

    }

}
//check user is authenticaed
export const isAuthenticated = async(req,res)=>{
    try {
        return res.json({success: true});
    } catch (error) {
        res.json({success: false, message: error.message});
    }
}


//password reset using otp 
//password reset using otp 
export const sendResetOtp = async (req,res) => {
    const{email} = req.body;
    if(!email){
        return res.json({success:false, message: 'Email is required'})
    }
    try {
        const user = await userModel.findOne({email});
        if(!user){
            return res.json({success: false, message: 'User not found'});
        }
        const otp = String(Math.floor(100000 + Math.random() * 900000))
        user.resetOtp = otp;
        user.resetOtpExpireAt = Date.now()+ 15 * 60 * 1000
        await user.save();
        
        const mailOption = {
            from: process.env.SENDER_EMAIL, // Make sure this is set in .env
            to: user.email,
            subject: 'Password Reset OTP - CodeClash',
            text: `Your OTP for resetting your password is ${otp}. Use this OTP to reset your password. This OTP will expire in 15 minutes.`
        }
        
        console.log('Attempting to send email to:', user.email); // Add logging
        await transporter.sendMail(mailOption);
        console.log('Email sent successfully to:', user.email); // Add logging
        
        res.json({success: true, message: "Password reset OTP sent on email"});

    } catch (error) {
        console.error('sendResetOtp error:', error); // Add detailed logging
        return res.json({success:false, message: error.message})
    }
}

//reset user pass
export const resetPassword = async (req,res)=>{
    const {email,otp,newPassword} = req.body;
    if(!email || !otp || !newPassword){
        return res.json ({success: false, message: 'Email , OTP and new password required'});
    }
    try {
        const user = await userModel.findOne({email});
        if(!user){
            return res.json({success: false, message: 'User not found'});
        }
        if(user.resetOtp === " " || user.resetOtp !== otp){
            return res.json({success: false, message: 'Invalid otp'});
        }
        if (user.resetOtpExpireAt < Date.now()) {
            return res.json({success: false, message: 'OTP expired'});
        }

        const hashedpassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedpassword;
        user.resetOtp = ' ';
        user.resetOtpExpireAt = 0;
        await user.save();

        res.json({success:true, message: 'Password has been successfully reset'})
    } catch (error) {
        return res.json({success: false, message: error.message});
    }
}

export { googleLogin };