import express from 'express';
import { Joi, celebrate } from 'celebrate';
import { CardController } from '../controllers';

const cardRoutes = express.Router();

cardRoutes.get('/', CardController.get);

cardRoutes.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string().required(),
      owner: Joi.object(),
      likes: Joi.array().items(Joi.object()).default([]),
      createdAt: Joi.date().default(Date.now()),
    }),
  }),
  CardController.post,
);

cardRoutes.delete(
  '/:cardId',
  celebrate({
    params: {
      cardId: Joi.string().alphanum().required(),
    },
  }),
  CardController.delete,
);

cardRoutes.put(
  '/:cardId/likes',
  celebrate({
    params: {
      cardId: Joi.string().alphanum().required(),
    },
  }),
  CardController.likeCard,
);

cardRoutes.delete(
  '/:cardId/likes',
  celebrate({
    params: {
      cardId: Joi.string().alphanum().required(),
    },
  }),
  CardController.dislikeCard,
);

export default cardRoutes;
