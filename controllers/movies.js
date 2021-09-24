const Movie = require('../models/movie');
const NotValidError = require('../errors/not-valid-error');
const NotFoundError = require('../errors/not-found-error');
const NotAllowedError = require('../errors/not-allowed-error');
const constants = require('../constants');

module.exports.getMovies = (req, res, next) => {
  Movie.find()
    .then((c) => res.send(c))
    .catch(next);
};

module.exports.addMovie = (req, res, next) => {
  const {
    country, director, duration, year,
    description, image, trailer, nameRU, nameEN, thumbnail, movieId,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: req.user._id,
  })
    .then((c) => res.send(c))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new NotValidError(err.message);
      }
      throw err;
    })
    .catch(next);
};

module.exports.removeMovie = (req, res, next) => {
  const { id } = req.params;

  Movie.findById(id).then((c) => {
    if (!c) {
      throw new NotFoundError(constants.MOVIE_NOT_FOUND);
    }
    if (c.owner.toString() !== req.user._id) {
      throw new NotAllowedError(constants.USER_NOT_ALLOWED_TO_DELETE);
    }
    Movie.deleteOne(c)
      .then(() => res.send({ message: constants.MOVIE_DELETED }))
      .catch(next);
  })
    .catch(next);
};
