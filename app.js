const PORT = '3000';
const DB_PORT = '27017';
const express = require('express');
const mongoose = require('mongoose');
const NotFoundError = require('./errors/not-found-error');
const exceptionHandler = require('./middlewares/exception-handler');
const usersRouter = require('./routes/users');
const moviesRouter = require('./routes/movies');
const { addUser, login } = require('./controllers/users');

const app = express();

app.use(express.json());

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.get('/health-check', (req, res) => {
  res.send({ status: 'ok' });
});

app.post('/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  }), login);
app.post('/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required().min(8),
      name: Joi.string().min(2).max(30),
    }),
  }), addUser);

app.use('/users', usersRouter);
app.use('/movies', moviesRouter);

app.use('/', () => { throw new NotFoundError('Resource not found'); });

mongoose.connect(`mongodb://localhost:${DB_PORT}/movies-explorer`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(exceptionHandler);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Listening at http://localhost:${PORT}`);
});
