import { Router } from 'express';
import { Joi, celebrate } from 'celebrate';
import { UserController } from '../controllers';

const userRoutes = Router();

userRoutes.get(
  '/',
  celebrate({
    cookies: Joi.object()
      .keys({
        jwt: Joi.string().required(),
      })
      .unknown(true),
  }),
  UserController.get,
);

userRoutes.get(
  '/me',
  celebrate({
    cookies: Joi.object()
      .keys({
        jwt: Joi.string().required(),
      })
      .unknown(true),
  }),
  UserController.getMe,
);

userRoutes.get(
  '/:userId',
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().hex().length(24).required(),
    }),
    cookies: Joi.object()
      .keys({
        jwt: Joi.string().required(),
      })
      .unknown(true),
  }),
  UserController.getById,
);

userRoutes.patch(
  '/me',
  celebrate({
    cookies: Joi.object()
      .keys({
        jwt: Joi.string().required(),
      })
      .unknown(true),
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30).required(),
      about: Joi.string().min(2).max(200).required(),
      user: Joi.object().required(),
    }),
  }),
  UserController.updateMe,
);

userRoutes.patch(
  '/me/avatar',
  celebrate({
    cookies: Joi.object()
      .keys({
        jwt: Joi.string().required(),
      })
      .unknown(true),
    body: Joi.object().keys({
      avatar: Joi.string()
        .required()
        .pattern(
          /^(https?:\/\/)(w{3}\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[a-zA-Z0-9\-._~:/?#[\]@!$&'()*+,;=]*)?(#)?$/,
        ),
      user: Joi.object().required(),
    }),
  }),
  UserController.updateMeAvatar,
);

export default userRoutes;
