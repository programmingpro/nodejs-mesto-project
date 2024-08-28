import {
  ErrorRequestHandler, Request, Response, NextFunction,
} from 'express';
import statusCodes from './statusCodes';
import CustomError from './types';

const errorsHandler: ErrorRequestHandler = (
  err: CustomError,
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  const statusCode = err.statusCode || statusCodes.Default;
  const message = statusCode === statusCodes.Default
    ? 'На сервере произошла ошибка'
    : err.message;

  res.status(statusCode).send({
    statusCode,
    message,
  });

  next();
};

export default errorsHandler;
