const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const exceptionHandler = require('./middlewares/exception-handler');
const router = require('./routes/index');
const { MONGO_URL, PORT } = require('./config');

const app = express();
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:8000'],
  methods: ['GET', 'PUT', 'POST', 'DELETE', 'PATCH'],
  allowedHeaders: ['Authorization', 'Content-Type'],
}));

app.use(cookieParser());
app.use(express.json());

app.use(router);

mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(errors());
app.use(exceptionHandler);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Listening at http://localhost:${PORT}`);
});
