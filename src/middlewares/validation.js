/**
 * Validation Middleware
 * Validates user input for registration and login
 */

/**
 * Validate registration data
 */
const validateRegister = (req, res, next) => {
  const { username, email, password } = req.body;
  const errors = [];

  // Validate username
  if (!username || username.trim().length === 0) {
    errors.push('Username is required');
  } else if (username.length < 3) {
    errors.push('Username must be at least 3 characters long');
  } else if (username.length > 50) {
    errors.push('Username cannot exceed 50 characters');
  } else if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    errors.push('Username can only contain letters, numbers, underscores, and hyphens');
  }

  // Validate email
  if (!email || email.trim().length === 0) {
    errors.push('Email is required');
  } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    errors.push('Please provide a valid email address');
  }

  // Validate password
  if (!password || password.length === 0) {
    errors.push('Password is required');
  } else if (password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  } else if (password.length > 100) {
    errors.push('Password cannot exceed 100 characters');
  }

  // Check for errors
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
};

/**
 * Validate login data
 */
const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  // Validate email
  if (!email || email.trim().length === 0) {
    errors.push('Email is required');
  } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    errors.push('Please provide a valid email address');
  }

  // Validate password
  if (!password || password.length === 0) {
    errors.push('Password is required');
  }

  // Check for errors
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
};

/**
 * Validate profile update data
 */
const validateProfileUpdate = (req, res, next) => {
  const { username, email, newPassword, currentPassword } = req.body;
  const errors = [];

  // Validate username if provided
  if (username !== undefined) {
    if (username.trim().length === 0) {
      errors.push('Username cannot be empty');
    } else if (username.length < 3) {
      errors.push('Username must be at least 3 characters long');
    } else if (username.length > 50) {
      errors.push('Username cannot exceed 50 characters');
    } else if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
      errors.push('Username can only contain letters, numbers, underscores, and hyphens');
    }
  }

  // Validate email if provided
  if (email !== undefined) {
    if (email.trim().length === 0) {
      errors.push('Email cannot be empty');
    } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      errors.push('Please provide a valid email address');
    }
  }

  // Validate password change
  if (newPassword !== undefined) {
    if (!currentPassword) {
      errors.push('Current password is required to set a new password');
    }
    if (newPassword.length < 6) {
      errors.push('New password must be at least 6 characters long');
    }
    if (newPassword.length > 100) {
      errors.push('New password cannot exceed 100 characters');
    }
  }

  // Check for errors
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
};

module.exports = {
  validateRegister,
  validateLogin,
  validateProfileUpdate
};