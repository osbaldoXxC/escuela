import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../../config.js';
import { loginSchema } from '../schemas/user.schema.js';

export const login = async (req, res) => {
  try {
    // Validate request body
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { username, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create and return token
    const payload = {
      user: {
        id: user.id,
        username: user.username
      }
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

    res.json({ 
      success: true,
      message: 'Login successful',
      token 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};