const router = require('express').Router();
const NotFoundError = require('../errors/not-found-error');
const auth = require('../middlewares/auth');
const { addUser, login } = require('../controllers/users');
const usersRouter = require('./users');
const moviesRouter = require('./movies');
const { validateLogin, validateRegistration } = require('../middlewares/validations');

router.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

router.get('/health-check', (req, res) => {
  res.send({ status: 'ok' });
});

router.post('/signin',
  validateLogin, login);
router.post('/signup', validateRegistration, addUser);

router.use(auth);

router.use('/users', usersRouter);
router.use('/movies', moviesRouter);

router.use('/', () => { throw new NotFoundError('Resource not found'); });

module.exports = router;
