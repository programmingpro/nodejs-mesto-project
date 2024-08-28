import { Router } from 'express';
import { Joi, celebrate } from 'celebrate';
import { UserController } from '../controllers';

const userRoutes = Router();

userRoutes.get('/', UserController.get);

userRoutes.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      about: Joi.string().required().min(2).max(200),
      avatar: Joi.string().required(),
    }),
  }),
  UserController.post,
);

userRoutes.get(
  '/:userId',
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().alphanum().length(24).required(),
    }),
  }),
  UserController.getById,
);

userRoutes.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      about: Joi.string().required().min(2).max(200),
    }),
  }),
  UserController.updateMe,
);

userRoutes.patch(
  '/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().required(),
    }),
  }),
  UserController.updateMeAvatar,
);

export default userRoutes;
