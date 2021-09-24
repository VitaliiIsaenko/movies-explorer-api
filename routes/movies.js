const router = require('express').Router();
const {
  getMovies, addMovie, removeMovie,
} = require('../controllers/movies');
const { validateAddMovie, validateDeleteMovie } = require('../middlewares/validations');

router.get('/', getMovies);

router.post('/', validateAddMovie, addMovie);

router.delete('/:id', validateDeleteMovie, removeMovie);

module.exports = router;
