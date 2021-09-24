const { Joi, celebrate } = require('celebrate');

const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

const validateRegistration = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
  }),
});

const validateAddMovie = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    image: Joi.string().required().pattern(/https?:\/\/(www\.)?[\w\d-]+\.[\w\d-.~:/?#[\]@!$&'()*+,;=]+#?/),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    trailer: Joi.string().required().pattern(/https?:\/\/(www\.)?[\w\d-]+\.[\w\d-.~:/?#[\]@!$&'()*+,;=]+#?/),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    thumbnail: Joi.string().required().pattern(/https?:\/\/(www\.)?[\w\d-]+\.[\w\d-.~:/?#[\]@!$&'()*+,;=]+#?/),
  }),
});

const validateDeleteMovie = celebrate({
  params: Joi.object().keys({
    id: Joi.string().required().length(24).hex(),
  }),
});

const validateGetCurrentUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().email().required(),
  }),
});

module.exports = {
  validateLogin,
  validateRegistration,
  validateAddMovie,
  validateDeleteMovie,
  validateGetCurrentUser,
};
