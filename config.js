require('dotenv').config();

const {
  JWT_SECRET = '123',
  NODE_ENV = 'development',
  MONGO_URL = 'mongodb://localhost:27017/moviesdb',
  PORT = '3000',
} = process.env;

module.exports = {
  PORT,
  JWT_SECRET,
  NODE_ENV,
  MONGO_URL,
};
