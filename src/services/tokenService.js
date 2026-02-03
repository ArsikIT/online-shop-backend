const jwt = require('jsonwebtoken');

class TokenService {
  /**
   * Generate JWT access token
   * @param {Object} payload - User data to encode
   * @returns {string} - JWT token
   */
  generateAccessToken(payload) {
    return jwt.sign(
      {
        id: payload.id,
        email: payload.email,
        role: payload.role
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );
  }

  /**
   * Verify JWT token
   * @param {string} token - JWT to verify
   * @returns {Object} - Decoded payload
   * @throws {Error} - If token invalid
   */
  verifyToken(token) {
    return jwt.verify(token, process.env.JWT_SECRET);
  }
}

module.exports = new TokenService();