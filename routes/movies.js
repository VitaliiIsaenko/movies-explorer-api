const router = require('express').Router();
const {
  getMovies, addMovie, removeMovie,
} = require('../controllers/movies');
const { validateAddMovie, validateGetMovie } = require('../middlewares/validations');

router.get('/', getMovies);

router.post('/', validateAddMovie, addMovie);

router.delete('/:id', validateGetMovie, removeMovie);

module.exports = router;
