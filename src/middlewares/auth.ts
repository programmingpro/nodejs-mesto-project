import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import UnauthorizedError from '../errors/unAuthorized';

const { SECRET_KEY = 'secret-key' } = process.env;

const auth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies?.jwt;

  if (!token) {
    return next(new UnauthorizedError('Требуется авторизация'));
  }

  let payload;

  try {
    payload = jwt.verify(token, SECRET_KEY);
  } catch (err) {
    return next(new UnauthorizedError('Требуется авторизация'));
  }

  req.body.user = payload;

  return next();
};

export default auth;
