import User from '../models/User.js';
import axios from 'axios';

export const registerUser = async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Create new user
    const newUser = new User({
      fullName,
      email,
      password, // Note: In production, you should hash this password
      role,
      hasFilledForm: false
    });

    await newUser.save();

    res.status(201).json({
      _id: newUser._id,
      fullName: newUser.fullName,
      email: newUser.email,
      role: newUser.role,
      hasFilledForm: newUser.hasFilledForm
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email, password });
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      hasFilledForm: user.hasFilledForm
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const googleAuth = async (req, res) => {
  try {
    const { token } = req.body;
    
    // Verify the Google token and get user info
    const googleResponse = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${token}` }
    });

    const { email, name, picture } = googleResponse.data;

    // Check if user exists
    let user = await User.findOne({ email });

    if (!user) {
      // Create new user with Google info
      user = new User({
        fullName: name,
        email,
        password: 'google-auth-' + Math.random().toString(36).slice(-8), // Random string as password
        role: 'investor', // Default role
        hasFilledForm: false,
        avatar: picture, // Store Google profile picture
        isGoogleAuth: true // Flag to identify Google-authenticated users
      });
      await user.save();
    }

    // Return user data (excluding sensitive fields)
    const userData = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      hasFilledForm: user.hasFilledForm,
      avatar: user.avatar
    };

    res.json(userData);
  } catch (error) {
    console.error('Google authentication error:', error);
    
    // Handle different error scenarios
    if (error.response) {
      if (error.response.status === 400) {
        return res.status(400).json({ message: 'Invalid Google token' });
      }
      return res.status(502).json({ message: 'Error communicating with Google' });
    }
    
    res.status(500).json({ 
      message: 'Google authentication failed',
      error: error.message 
    });
  }
};