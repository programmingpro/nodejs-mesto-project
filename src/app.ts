import express from 'express';
import mongoose from 'mongoose';
import { errors } from 'celebrate';
import {
  userRoutes,
  cardRoutes,
} from './routes';
import { errorsHandler } from './errors';
import authMe from './middlewares/auth';

const {
  PORT = 5000,
  MONGODB_URL = 'mongodb://localhost:27017/mestodb',
} = process.env;

const app = express();

app
  .use(express.json())
  .use(express.urlencoded({ extended: true }))
  .use(authMe)
  .use('/users', userRoutes)
  .use('/cards', cardRoutes)
  .use(errors())
  .use(errorsHandler);

const bootstrap = async () => {
  try {
    await mongoose.connect(MONGODB_URL);
    console.log('db connection is ok');

    await app.listen(+PORT, () => {
      console.log(`started on port : ${PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
};

bootstrap();
