import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Helper to generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// @route   POST /api/auth/register
export const register = async (req, res) => {
    try {
      const { name, email, phone, password, role } = req.body; // ✅ Add `phone`
  
      // Check if user already exists
      const userExists = await User.findOne({ email });
      if (userExists) return res.status(400).json({ message: 'User already exists' });
  
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create user with phone
      const user = await User.create({ name, email, phone, password: hashedPassword, role }); // ✅ Save `phone`
  
      // Generate token
      const token = generateToken(user);
  
      res.status(201).json({
        message: 'User registered successfully',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone, // ✅ return it
          role: user.role,
        },
        token,
      });
    } catch (err) {
      console.error('Registration Error:', err.message);
      res.status(500).json({ message: 'Error registering user', error: err.message });
    }
  };
  

// @route   POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    // Generate token
    const token = generateToken(user);

    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (err) {
    console.error('Login Error:', err.message);
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};
