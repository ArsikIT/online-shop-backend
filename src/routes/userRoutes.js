const express = require('express');
const router = express.Router();
const { getProfile, updateProfile } = require('../controllers/userController');
const authMiddleware = require('../middlewares/auth');
const { validateProfileUpdate } = require('../middlewares/validation');

/**
 * User Routes
 */

/**
 * @route   GET /api/users/profile
 * @desc    Get logged-in user's profile
 * @access  Private
 */
router.get('/profile', authMiddleware, getProfile);

/**
 * @route   PUT /api/users/profile
 * @desc    Update logged-in user's profile with validation
 * @access  Private
 */
router.put('/profile', authMiddleware, validateProfileUpdate, updateProfile);

module.exports = router;