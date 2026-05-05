import User from "../models/User.js";

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const allowedUpdates = ['name', 'avatar', 'preferences'];
    const updates = {};
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true });
    res.json({ success: true, message: 'Profile updated successfully!', user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update profile.' });
  }
};

// @desc    Update favorite destinations
// @route   PUT /api/users/favorites
// @access  Private
export const updateFavorites = async (req, res) => {
  try {
    const { destination, action } = req.body;
    const user = await User.findById(req.user._id);

    if (action === 'add') {
      if (!user.favoriteDestinations.includes(destination)) {
        user.favoriteDestinations.push(destination);
      }
    } else if (action === 'remove') {
      user.favoriteDestinations = user.favoriteDestinations.filter(d => d !== destination);
    }

    await user.save();
    res.json({ success: true, favoriteDestinations: user.favoriteDestinations });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update favorites.' });
  }
};

// @desc    Get all users (admin only)
// @route   GET /api/users
// @access  Private/Admin
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, users });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch users.' });
  }
};