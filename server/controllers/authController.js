import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';


export const register = async (req, res) => {
    try {
      console.log('Request body:', req.body);  // Log incoming request body to inspect
      const { name, email, password, role } = req.body;
  
      if (!name || !email || !password) {
        return res.status(400).json({ message: 'Name, email, and password are required' });
      }
  
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const newUser = new User({
        name,
        email,
        password: hashedPassword,
        role: role || 'user',  // Defaults to 'user' if no role is provided
      });
  
      await newUser.save();
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      console.error('Error registering user:', error);  // Log the error to the console
      res.status(500).json({ message: 'Error registering user', error: error.message });
    }
  };
  

  export const login = async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
  
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
  
      const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: '7d',
      });
  
      res.json({
        user: { id: user._id, name: user.name, email: user.email, role: user.role },
        token,
      });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  };
  


// Update user profile

export const updateProfile = asyncHandler(async (req, res) => {
    const userId = req.user.id; // Extracted from verifyToken middleware
    const { firstName, lastName, phone } = req.body;

    try {
        // Find user by ID
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update only the allowed fields
        user.firstName = firstName || user.firstName;
        user.lastName = lastName || user.lastName;
        user.phone = phone || user.phone;

        // Save updated user
        const updatedUser = await user.save();

        res.json({
            id: updatedUser._id,
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
            email: updatedUser.email, // Email remains unchanged
            phone: updatedUser.phone,
            profileImage: updatedUser.profileImage,
        });

    } catch (error) {
        console.error("Profile update error:", error);
        res.status(500).json({ message: "Profile update failed" });
    }
});


//  Update User Address

export const updateAddress = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { street, buildingName, landmark, city, state, pinCode, isDefault } = req.body;

    console.log('Received Address Data:', req.body);

    if (!street || !city || !state || !pinCode) {
        return res.status(400).json({ message: 'Street, city, state, and pin code are required' });
    }

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // ✅ Save address properly
        user.address = { street, buildingName, landmark, city, state, pinCode, isDefault };
        const updatedUser = await user.save();

        console.log('Updated User:', updatedUser);
        res.json({ message: 'Address updated successfully', address: updatedUser.address });

    } catch (error) {
        console.error('Error updating address:', error);
        res.status(500).json({ message: 'Failed to update address' });
    }
});
