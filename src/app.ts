import express from 'express';
import mongoose from 'mongoose';
import { errors } from 'celebrate';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import {
  userRoutes,
  cardRoutes,
} from './routes';
import { errorsHandler } from './errors';
import {
  auth,
  requestLogger,
  errorLogger,
  notFoundPage,
  signInValidation,
  signUpValidation,
} from './middlewares';
import { UserController } from './controllers';

const {
  PORT = 3000,
  MONGODB_URL = 'mongodb://localhost:27017/mestodb',
} = process.env;

const app = express();

app
  .use(cookieParser())
  .use(helmet())
  .use(express.json())
  .use(express.urlencoded({ extended: true }))
  .use(requestLogger)
  .post('/signin', signInValidation(), UserController.login)
  .post('/signup', signUpValidation(), UserController.post)
  .use(auth)
  .use('/users', userRoutes)
  .use('/cards', cardRoutes)
  .use('*', notFoundPage)
  .use(errorLogger)
  .use(errors())
  .use(errorsHandler);

const bootstrap = async () => {
  try {
    await mongoose.connect(MONGODB_URL);
    console.log('База MongoDB подключена');

    await app.listen(+PORT, () => {
      console.log(`Приложение запустилось на порту: ${PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
};

bootstrap();
