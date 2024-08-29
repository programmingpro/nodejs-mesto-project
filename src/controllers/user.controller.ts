import { Request, Response, NextFunction } from 'express';
import { UpdateQuery } from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User, { IUser } from '../models/user.model';
import {
  NotFoundError, BadRequestError, statusCodes, CoincidenceError, UnauthorizedError,
} from '../errors';

class UserController {
  static get(req: Request, res: Response, next: NextFunction) {
    User.find({})
      .then((data) => res.json(data))
      .catch(next);
  }

  static getById(req: Request, res: Response, next: NextFunction) {
    const { userId } = req.params;
    User.findById(userId)
      .orFail(() => {
        throw new NotFoundError('Передан некорректный _id пользователя');
      })
      .then((data) => res.json(data))
      .catch(next);
  }

  static getMe(req: Request, res: Response, next: NextFunction) {
    const { _id } = req.body.user;
    User.findById(_id)
      .orFail(() => new UnauthorizedError('Требуется авторизация'))
      .then((data) => res.json(data))
      .catch(next);
  }

  static post(req: Request, res: Response, next: NextFunction) {
    const {
      email, password, name, about, avatar,
    }: IUser = req.body;

    bcrypt
      .hash(password, 10)
      .then((hash) => User.create(
        {
          email,
          password: hash,
          name,
          about,
          avatar,
        },
      ))
      .then(() => {
        res.status(statusCodes.Created).send({
          email,
          name,
          about,
          avatar,
        });
      })
      .catch((err) => {
        if (err.code === 11000) {
          return next(
            new CoincidenceError('Пользователь с данной почтой уже существует'),
          );
        }

        if (err.statusCode === statusCodes.BadRequest) {
          return next(new BadRequestError('Неверные данные пользователя'));
        }

        return next(err);
      });
  }

  static update(update: UpdateQuery<IUser>, req: Request, res: Response, next: NextFunction) {
    const userId = req.body.user._id;
    User.findByIdAndUpdate(userId, update, { new: true, runValidators: true })
      .orFail(() => new NotFoundError('Пользователь с указанным _id не найден'))
      .then((user) => res.send(user))
      .catch((err) => {
        if (err.statusCode === statusCodes.BadRequest) {
          return next(new BadRequestError('Переданы некорректные данные при обновлении пользователя'));
        }
        return next;
      });
  }

  static updateMeAvatar(req: Request, res: Response, next: NextFunction) {
    const { avatar }: Pick<IUser, 'avatar'> = req.body;
    UserController.update({ avatar }, req, res, next);
  }

  static updateMe(req: Request, res: Response, next: NextFunction) {
    const { name, about }: Omit<IUser, 'avatar'> = req.body;
    UserController.update({ name, about }, req, res, next);
  }

  static login(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;

    return User.findUserByCredentials(email, password)
      .then((user) => {
        const token = jwt.sign({ _id: user._id }, 'secret-key', { expiresIn: '7d' });

        res.cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
        }).send({
          message: true,
        });
      })
      .catch(next);
  }
}

export default UserController;
