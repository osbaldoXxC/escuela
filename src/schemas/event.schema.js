import Joi from 'joi';

export const eventSchema = Joi.object({
  title: Joi.string().required().min(3).max(100),
  description: Joi.string().required().min(10).max(1000),
  date: Joi.date().required(),
  images: Joi.array().items(Joi.string()).optional()
});