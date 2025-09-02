import User from '../../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { connect } from 'mongoose';
import { sendOtpEmail, sendSignupSuccessEmail } from '../../utils/email.util.js';
import crypto from 'crypto';

// Helper to sign JWT access token
const signAccessToken = (user) => {
  return jwt.sign(
    { _id: user._id, email: user.email, role: 'user' },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );
};

// Helper to sign JWT refresh token
const signRefreshToken = (user) => {
  return jwt.sign(
    { _id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};


export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required.'
      });
    }
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered.'
      });
    }
    const hashed = await bcrypt.hash(password, 10);
   
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);
  
    await sendOtpEmail(email, otp);
    const user = await User.create({
      name,
      email,
      password: hashed,
      otp,
      otpExpires,
      isVerified: false
    });
    return res.status(201).json({
      success: true,
      message: 'Registration successful. Please verify your email with the OTP sent.'
    });
  } catch (err) {
    
    next(err);
  }
};

// Verify OTP
export const verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    if (user.isVerified) {
      return res.status(409).json({ success: false, message: 'User already verified.' });
    }
    if (!user.otp || !user.otpExpires || user.otp !== otp) {
      return res.status(400).json({ success: false, message: 'Invalid OTP.' });
    }
    if (user.otpExpires < new Date()) {
      return res.status(400).json({ success: false, message: 'OTP expired.' });
    }
    user.isVerified = true;
    user.otp = null;
    user.otpExpires = null;
    await user.save();
   

    await sendSignupSuccessEmail(user.email, user.name);
    return res.json({ success: true, message: 'Email verified successfully.' });
  } catch (err) {
    next(err);
  }
};

// Resend OTP
export const resendOtp = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    if (user.isVerified) {
      return res.status(409).json({ success: false, message: 'User already verified.' });
    }
  
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();
    await sendOtpEmail(email, otp);
    return res.json({ success: true, message: 'OTP resent successfully.' });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

// Login user and issue tokens as cookies (only if verified)
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials.'
      });
    }
    
    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: 'Please verify your email before logging in.'
      });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials.'
      });
    }
    

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);

   
    user.refreshTokens.push(refreshToken);
    await user.save();

    
     res.cookie('accessToken', accessToken, {
      httpOnly: true, // mtlb js access ni kr skti cookie by document.cookie krke
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
      maxAge: 15 * 60 * 1000 // 15 minutes
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    return res.json({
      success: true,
      message: 'Login successful',
      user
    });
  } catch (err) {
    next(err);
  }
};

// Refresh access token using refresh token from cookies
export const refreshAccessToken = async (req, res, next) => {
  try {

    const refreshToken = req.cookies.refreshToken;
    // console.log(refreshToken);
    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token required.'
      });
    }

    // Verify refresh token
    let payload;
    try {
      payload = jwt.verify(refreshToken, process.env.JWT_SECRET);
      console.log(payload);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token.'
      });
    }

    const user = await User.findById(payload._id);
    // Check if refresh token is still valid (not logged out)
    if (!user || !user.refreshTokens.includes(refreshToken)) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token.'
      });
    }

    
    
    const accessToken = signAccessToken(user);
    console.log(accessToken);


    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000 // 15 minutes
    });

    return res.json({
      success: true,
      message: 'Token refreshed successfully',
      // accessToken,
      // refreshToken:user.refreshTokens[0]
    });
  } catch (err) {
    next(err);
  }
};

// Logout user 
export const logout = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      let payload;
      try {
        payload = jwt.verify(refreshToken, process.env.JWT_SECRET);
      } catch (err) {
        // Token invalid, just clear cookies
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        return res.json({
          success: true,
          message: 'Logged out successfully.'
        });
      }

      const user = await User.findById(payload.id);
      if (user) {
        
        user.refreshTokens = user.refreshTokens.filter((t) => t !== refreshToken);
        await user.save();
      }
    }

    // Clear cookies so koi login na kar sake bina cookie ke
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    return res.json({
      success: true,
      message: 'Logged out successfully.'
    });
  } catch (err) {
    next(err);
  }
}; 