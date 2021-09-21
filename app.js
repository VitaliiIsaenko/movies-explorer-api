const PORT = '3000';
const DB_PORT = '27017';
const express = require('express');
const mongoose = require('mongoose');
const { celebrate, Joi, errors } = require('celebrate');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const NotFoundError = require('./errors/not-found-error');
const exceptionHandler = require('./middlewares/exception-handler');
const usersRouter = require('./routes/users');
const moviesRouter = require('./routes/movies');
const auth = require('./middlewares/auth');
const { addUser, login } = require('./controllers/users');
require('dotenv').config();

const app = express();
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:8000'],
  methods: ['GET', 'PUT', 'POST', 'DELETE', 'PATCH'],
  allowedHeaders: ['Authorization', 'Content-Type'],
}));

app.use(cookieParser());
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

app.use(auth);

app.use('/users', usersRouter);
app.use('/movies', moviesRouter);

app.use('/', () => { throw new NotFoundError('Resource not found'); });

mongoose.connect(`mongodb://localhost:${DB_PORT}/movies-explorer`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(errors());
app.use(exceptionHandler);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Listening at http://localhost:${PORT}`);
});
