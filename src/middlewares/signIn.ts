import { Joi, celebrate } from 'celebrate';

const signInValidation = () => celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

export default signInValidation;
