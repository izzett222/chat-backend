import Joi from 'joi';

export const signupSchema = Joi.object({
  username: Joi.string()
    .trim()
    .alphanum()
    .min(3)
    .max(10)
    .required(),
  password: Joi.string().trim().min(3).required(),
});

export const loginSchema = Joi.object({
  username: Joi.string().trim().required(),
  password: Joi.string().trim().required(),
});
