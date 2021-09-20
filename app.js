const PORT = '3000';
const DB_PORT = '27017';
const express = require('express');
const mongoose = require('mongoose');
const NotFoundError = require('./errors/not-found-error');
const exceptionHandler = require('./middlewares/exception-handler');
const usersRouter = require('./routes/users');

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
app.use('/users', usersRouter);
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
