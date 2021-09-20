const User = require('../models/user');
const NotFoundError = require('../errors/not-found-error');
const NotValidError = require('../errors/not-valid-error');

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
        throw new NotValidError(err.message);
      }
      throw err;
    })
    .catch(next);
};
