import mongoose, { Model, Schema, Document } from 'mongoose';
import { isEmail, isURL } from 'validator';
import bcrypt from 'bcryptjs';
import UnauthorizedError from '../errors/unAuthorized';

export interface IUser {
  email: string
  password: string
  name: string
  about: string
  avatar: string
}

interface IUserModel extends Model<IUser> {
  // eslint-disable-next-line no-unused-vars
  findUserByCredentials: (email: string, password: string)
    => Promise<Document<unknown, any, IUser>>;
}

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    validate: {
      validator: (v: string) => isEmail(v),
      message: 'Некорректный email',
    },

    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    min: 2,
    max: 30,
    required: true,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    min: 2,
    max: 200,
    required: true,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    required: true,
    validate: isURL,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
}, { versionKey: false });

userSchema.static(
  'findUserByCredentials',
  function findUserByCredentials(email: string, password: string) {
    return this.findOne({ email })
      .select('+password')
      .then((user: IUser) => {
        if (!user) {
          throw new UnauthorizedError('Пользователь не найден');
        }

        return bcrypt.compare(password, user.password).then((matched) => {
          if (!matched) {
            throw new UnauthorizedError('Неверные почта или пароль');
          }

          return user;
        });
      });
  },
);

export default mongoose.model<IUser, IUserModel>('user', userSchema);
