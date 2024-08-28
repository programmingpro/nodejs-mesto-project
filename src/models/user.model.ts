import { model, Schema } from 'mongoose';

export interface IUser {
  name: string
  about: string
  avatar: string
}

const userSchema = new Schema<IUser>({
  about: {
    max: 200,
    type: String,
    min: 2,
    required: true,
  },
  avatar: {
    required: true,
    type: String,
  },
  name: {
    type: String,
    min: 2,
    max: 30,
    required: true,
  },
});

export default model<IUser>('user', userSchema);
