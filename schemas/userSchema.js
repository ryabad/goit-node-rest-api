import Joi from "joi";

export const signupUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  subscription: Joi.string().valid("starter", "pro", "business").messages({
    "any.only": "Only starter, pro, business",
  }),
});

export const loginUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const updateSubSchema = Joi.object({
  subscription: Joi.string()
    .valid("starter", "pro", "business")
    .required()
    .messages({
      "any.only": "Only starter, pro, business",
    }),
});

export const verificationSchema = Joi.object({
  email: Joi.string().email().required(),
});
