const mongoose = require('mongoose');
const validator = require('validator');
const constants = require('../constants');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: false,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return validator.isURL(v);
      },
      message: () => constants.LINK_INVALID,
    },
  },
  trailer: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return validator.isURL(v);
      },
      message: () => constants.LINK_INVALID,
    },
  },
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return validator.isURL(v);
      },
      message: () => constants.LINK_INVALID,
    },
  },
  owner: {
    type: mongoose.Types.ObjectId,
    requried: true,
    ref: 'user',
  },
  movieId: {
    type: Number,
    requried: true,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
  __v: { type: Number, select: false },
}, { versionKey: false });

module.exports = mongoose.model('movie', movieSchema);
