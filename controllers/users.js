const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-error');
const NotValidError = require('../errors/not-valid-error');
const AlreadyExistsError = require('../errors/already-exists-error');
const { JWT_SECRET } = require('../config');

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((u) => {
      if (!u) {
        throw new NotFoundError('There is no such user');
      }
      res.send(u);
    })
    .catch(next);
};
module.exports.addUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, email, password: hash,
    }))
    .then((u) => res.status(200).send({
      name: u.name, email: u.email,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new NotValidError('Переданы невалидные данные');
      }
      if (err.code === 11000) {
        throw new AlreadyExistsError('Пользователь с этим email уже зарегестрирован');
      }
      throw err;
    })
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  const { name, email } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((u) => {
      if (!u) {
        throw new NotFoundError('There is no such user');
      }
      res.send(u);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new NotValidError('Переданы невалидные данные');
      }
      throw err;
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const sevenDays = 7 * 24 * 60 * 60;
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: sevenDays });
      res.send({ token });
    })
    .catch(next);
};
