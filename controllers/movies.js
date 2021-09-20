const Movie = require('../models/movie');
const NotValidError = require('../errors/not-valid-error');
const NotFoundError = require('../errors/not-found-error');
const NotAllowedError = require('../errors/not-allowed-error');

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
  const { movieId } = req.params;

  Movie.findById(movieId).then((c) => {
    if (!c) {
      throw new NotFoundError('There is no such card');
    }
    if (c.owner.toString() !== req.user._id) {
      throw new NotAllowedError('User is not allowed to delete the movie');
    }
    Movie.deleteOne(c)
      .then(() => res.send({ message: 'Movie was deleted' }))
      .catch(next);
  })
    .catch(next);
};
