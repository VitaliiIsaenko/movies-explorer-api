const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const UnauthorizedError = require('../errors/unauthorized-error');
const constants = require('../constants');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
    minlength: 2,
    maxlength: 30,
  },
  email: {
    type: String,
    validate: {
      validator(v) {
        return validator.isEmail(v);
      },
      message: () => constants.EMAIL_INVALID,
    },
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
}, { versionKey: false });

// eslint-disable-next-line func-names
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new UnauthorizedError(constants.PASSWORD_EMAIL_NOT_CORRECT));
      }

      return bcrypt.compare(password, user.password)
        .then((match) => {
          if (!match) {
            return Promise.reject(new UnauthorizedError(constants.PASSWORD_EMAIL_NOT_CORRECT));
          }

          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
