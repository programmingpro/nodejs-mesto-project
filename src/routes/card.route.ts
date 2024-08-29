import express from 'express';
import { Joi, celebrate } from 'celebrate';
import { CardController } from '../controllers';

const cardRoutes = express.Router();

cardRoutes.get(
  '/',
  celebrate({
    cookies: Joi.object()
      .keys({
        jwt: Joi.string().required(),
      })
      .unknown(true),
  }),
  CardController.get,
);

cardRoutes.post(
  '/',
  celebrate({
    cookies: Joi.object()
      .keys({
        jwt: Joi.string().required(),
      })
      .unknown(true),
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string()
        .required()
        .pattern(
          /^(https?:\/\/)(w{3}\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[a-zA-Z0-9\-._~:/?#[\]@!$&'()*+,;=]*)?(#)?$/,
        ),
      user: Joi.object(),
    }),
  }),
  CardController.post,
);

cardRoutes.delete(
  '/:cardId',
  celebrate({
    params: {
      cardId: Joi.string().length(24).hex().required(),
    },
    cookies: Joi.object()
      .keys({
        jwt: Joi.string().required(),
      })
      .unknown(true),
  }),
  CardController.delete,
);

cardRoutes.put(
  '/:cardId/likes',
  celebrate({
    params: {
      cardId: Joi.string().length(24).hex().required(),
    },
    cookies: Joi.object()
      .keys({
        jwt: Joi.string().required(),
      })
      .unknown(true),
  }),
  CardController.likeCard,
);

cardRoutes.delete(
  '/:cardId/likes',
  celebrate({
    params: {
      cardId: Joi.string().length(24).hex().required(),
    },
    cookies: Joi.object()
      .keys({
        jwt: Joi.string().required(),
      })
      .unknown(true),
  }),
  CardController.dislikeCard,
);

export default cardRoutes;
