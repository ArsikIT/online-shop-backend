const bcrypt = require('bcryptjs');

class PasswordService {
  /**
   * Hash password with bcrypt
   * @param {string} password - Plain text password
   * @returns {Promise<string>} - Hashed password
   */
  async hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  /**
   * Compare plain password with hashed password
   * @param {string} plainPassword - Password to check
   * @param {string} hashedPassword - Hashed password from DB
   * @returns {Promise<boolean>}
   */
  async comparePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}

module.exports = new PasswordService();