const Movie = require('../models/movie');
const NotValidError = require('../errors/not-valid-error');

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
