import { model, Schema } from 'mongoose';

export interface ICard {
    name: string
    link: string
    owner: Schema.Types.ObjectId;
    likes: Schema.Types.ObjectId[];
    createdAt: Date
}

const cardSchema = new Schema<ICard>({
  name: {
    type: String,
    min: 2,
    max: 30,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  owner: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  likes: [{
    type: Schema.Types.ObjectId,
    default: [],
    ref: 'user',
  }],
  createdAt: {
    type: Date,
    default: () => Date.now(),
  },
});

export default model<ICard>('card', cardSchema);
