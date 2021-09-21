const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const NotFoundError = require('../errors/not-found-error');
const auth = require('../middlewares/auth');
const { addUser, login } = require('../controllers/users');
const usersRouter = require('./users');
const moviesRouter = require('./movies');

router.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

router.get('/health-check', (req, res) => {
  res.send({ status: 'ok' });
});

router.post('/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  }), login);
router.post('/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required().min(8),
      name: Joi.string().min(2).max(30),
    }),
  }), addUser);

router.use(auth);

router.use('/users', usersRouter);
router.use('/movies', moviesRouter);

router.use('/', () => { throw new NotFoundError('Resource not found'); });

module.exports = router;
