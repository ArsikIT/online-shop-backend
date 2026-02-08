const User = require('../models/User');
const passwordService = require('./passwordService');
const tokenService = require('./tokenService');
const { sendWelcomeEmail } = require('./email.service');


class AuthService {
  /**
   * Register new user
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} - Created user and token
   */
  async register(userData) {
    const { username, email, password, firstName, lastName, phone } = userData;

    // Check if user exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      if (existingUser.email === email) {
        throw new Error('USER_EMAIL_EXISTS');
      }
      if (existingUser.username === username) {
        throw new Error('USERNAME_TAKEN');
      }
    }

    // Hash password
    const hashedPassword = await passwordService.hashPassword(password);

    // Create user
    const user = new User({
      username,
      email,
      password: hashedPassword,
      firstName,
      lastName,
      phone
    });

    await user.save();
    // Send welcome email (non-blocking)
try {
  await sendWelcomeEmail(user.email, user.username);
} catch (err) {
  console.error('Email error:', err.message);
}


    // Generate token
    const token = tokenService.generateAccessToken({
      id: user._id,
      email: user.email,
      role: user.role
    });

    return {
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        createdAt: user.createdAt
      },
      token
    };
  }

  /**
   * Login user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} - User data and token
   */
  async login(email, password) {
    // Find user
    const user = await User.findOne({ email });
    
    if (!user) {
      throw new Error('INVALID_CREDENTIALS');
    }

    // Check if active
    if (!user.isActive) {
      throw new Error('ACCOUNT_DEACTIVATED');
    }

    // Verify password
    const isPasswordValid = await passwordService.comparePassword(
      password,
      user.password
    );

    if (!isPasswordValid) {
      throw new Error('INVALID_CREDENTIALS');
    }

    // Generate token
    const token = tokenService.generateAccessToken({
      id: user._id,
      email: user.email,
      role: user.role
    });

    return {
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      },
      token
    };
  }

  /**
   * Get user by ID
   * @param {string} userId - User ID
   * @returns {Promise<Object>} - User without password
   */
  async getUserById(userId) {
    const user = await User.findById(userId).select('-password');
    if (!user) {
      throw new Error('USER_NOT_FOUND');
    }
    return user;
  }
}

module.exports = new AuthService();