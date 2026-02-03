const mongoose = require('mongoose');

/**
 * Database Connection Configuration
 */
const connectDB = async () => {
  try {
    // В Mongoose 6, 7, 8 и 9 объект с опциями больше не нужен
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log(` MongoDB Connected: ${conn.connection.host}`);
    console.log(` Database: ${conn.connection.name}`);

  } catch (error) {
    console.error(' MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;