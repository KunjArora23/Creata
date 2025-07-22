import User from '../../models/user.model.js';
import { uploadMedia, deleteMediaFromCloudinary } from '../../config/cloudinary.config.js';


// Get logged-in user's profile
export const getProfile = async (req, res, next) => {
  try {
    // req.user is set by verifyToken middleware
    const user = await User.findById(req.user._id).select('-password -refreshTokens');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }
    return res.json({
      success: true,
      message: 'Profile retrieved successfully',
      data: user
    });
  } catch (err) {
    next(err);
  }
};

// Update profile (bio, skills, status, profile photo)
export const updateProfile = async (req, res, next) => {
  try {
    if (typeof req.body.skills === 'string') {
      req.body.skills = req.body.skills.split(',').map(s => s.trim());
    }

    const { bio, skills, status } = req.body;

    // Get current user to check if we need to delete old image
    const currentUser = await User.findById(req.user._id);
    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }

    // Prepare update object
    const update = {};
    if (bio !== undefined) update.bio = bio;
    if (skills !== undefined) update.skills = skills;
    if (status !== undefined) update.status = status;

    // Handle profile photo upload
    if (req.file) {
      // Delete old image from Cloudinary if exists
      if (currentUser.cloudinaryId) {
        await deleteMediaFromCloudinary(currentUser.cloudinaryId);
      }

      // Upload new image to Cloudinary
      const uploadResponse = await uploadMedia(req.file.path, 'credmate/credmate-profiles');

      if (uploadResponse) {
        update.avatarUrl = uploadResponse.secure_url;
        update.cloudinaryId = uploadResponse.public_id;
      }
    }

    // Update user
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: update },
      { new: true, runValidators: true, select: '-password -refreshTokens' }
    );

    return res.json({
      success: true,
      message: 'Profile updated successfully',
      data: user
    });
  } catch (err) {
    next(err);
  }
};

// Set status (Active, Busy, Away, etc.)
export const setStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required.'
      });
    }
    // Only allow valid statuses
    const allowed = ['Active', 'Busy', 'Away', 'Offline'];
    if (!allowed.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status.'
      });
    }
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { status } },
      { new: true, runValidators: true, select: '-password -refreshTokens' }
    );
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }
    return res.json({
      success: true,
      message: 'Status updated successfully',
      data: { status: user.status }
    });
  } catch (err) {
    next(err);
  }
};