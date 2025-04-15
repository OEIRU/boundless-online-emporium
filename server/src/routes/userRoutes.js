
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { authenticate, rateLimiter } = require('../middleware/authMiddleware');

// Apply rate limiting to sensitive routes
router.use(['/login', '/register'], rateLimiter);

// Register a new user
router.post('/register', async (req, res) => {
  try {
    // Check if email already exists
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }
    
    // Create new user
    const user = new User({
      email: req.body.email,
      password: req.body.password,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phoneNumber: req.body.phoneNumber
    });
    
    await user.save();
    
    // Create and send JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );
    
    // Set secure cookie with token
    res.cookie('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    // Find user by email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    // Check password
    const isMatch = await user.comparePassword(req.body.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    // Create and send JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );
    
    // Set secure cookie with token
    res.cookie('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Logout user
router.post('/logout', (req, res) => {
  res.clearCookie('authToken');
  res.json({ message: 'Logged out successfully' });
});

// Get user profile (authenticated)
router.get('/profile', authenticate, async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user profile (authenticated)
router.put('/profile', authenticate, async (req, res) => {
  try {
    const userId = req.user.userId;
    
    // Remove fields that shouldn't be updated directly
    const { password, role, ...updateData } = req.body;
    
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { ...updateData, updatedAt: Date.now() },
      { new: true }
    ).select('-password');
    
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update user preferences (authenticated)
router.put('/preferences', authenticate, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { preferences } = req.body;
    
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { 
        'preferences': preferences,
        updatedAt: Date.now() 
      },
      { new: true }
    ).select('-password');
    
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update user avatar (authenticated)
router.put('/avatar', authenticate, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { avatar } = req.body;
    
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { 
        avatar,
        updatedAt: Date.now() 
      },
      { new: true }
    ).select('-password');
    
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Add to wishlist (authenticated)
router.post('/wishlist', authenticate, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId } = req.body;
    
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if product is already in wishlist
    if (user.wishlist.includes(productId)) {
      return res.status(400).json({ message: 'Product already in wishlist' });
    }
    
    user.wishlist.push(productId);
    await user.save();
    
    res.json({ message: 'Product added to wishlist' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Remove from wishlist (authenticated)
router.delete('/wishlist/:productId', authenticate, async (req, res) => {
  try {
    const userId = req.user.userId;
    const productId = req.params.productId;
    
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Remove product from wishlist
    user.wishlist = user.wishlist.filter(id => id.toString() !== productId);
    await user.save();
    
    res.json({ message: 'Product removed from wishlist' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Add new address (authenticated)
router.post('/address', authenticate, async (req, res) => {
  try {
    const userId = req.user.userId;
    const addressData = req.body;
    
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // If this is set as default, remove default flag from other addresses
    if (addressData.isDefault) {
      user.addresses.forEach(addr => {
        addr.isDefault = false;
      });
    }
    
    // If this is the first address, make it default
    if (user.addresses.length === 0) {
      addressData.isDefault = true;
    }
    
    user.addresses.push(addressData);
    user.updatedAt = Date.now();
    await user.save();
    
    res.json({ 
      message: 'Address added successfully',
      addresses: user.addresses
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update address (authenticated)
router.put('/address/:addressId', authenticate, async (req, res) => {
  try {
    const userId = req.user.userId;
    const addressId = req.params.addressId;
    const addressData = req.body;
    
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const addressIndex = user.addresses.findIndex(addr => addr._id.toString() === addressId);
    
    if (addressIndex === -1) {
      return res.status(404).json({ message: 'Address not found' });
    }
    
    // If this is set as default, remove default flag from other addresses
    if (addressData.isDefault) {
      user.addresses.forEach(addr => {
        addr.isDefault = false;
      });
    }
    
    user.addresses[addressIndex] = {
      ...user.addresses[addressIndex].toObject(),
      ...addressData
    };
    
    user.updatedAt = Date.now();
    await user.save();
    
    res.json({ 
      message: 'Address updated successfully',
      addresses: user.addresses
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete address (authenticated)
router.delete('/address/:addressId', authenticate, async (req, res) => {
  try {
    const userId = req.user.userId;
    const addressId = req.params.addressId;
    
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const deletedAddress = user.addresses.find(addr => addr._id.toString() === addressId);
    
    if (!deletedAddress) {
      return res.status(404).json({ message: 'Address not found' });
    }
    
    // Remove the address
    user.addresses = user.addresses.filter(addr => addr._id.toString() !== addressId);
    
    // If we deleted a default address and have other addresses, set the first one as default
    if (deletedAddress.isDefault && user.addresses.length > 0) {
      user.addresses[0].isDefault = true;
    }
    
    user.updatedAt = Date.now();
    await user.save();
    
    res.json({ 
      message: 'Address deleted successfully',
      addresses: user.addresses
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
