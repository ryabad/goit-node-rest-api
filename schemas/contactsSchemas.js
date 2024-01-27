import Joi from "joi";

const optionsValidate = {
  name: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{2,15}$")),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .message(`Email must contain '.com' or '.net' => example@test.com`),
  phone: Joi.string().pattern(new RegExp("^[0-9]{2,15}$")),
};

export const createContactSchema = Joi.object({
  ...optionsValidate,
  favorite: Joi.boolean().optional(),
})
  .options({ presence: "required" })
  .required();

export const updateContactSchema = Joi.object(optionsValidate).messages({
  "object.unknown": `You can change only "name"|"email"|"phone"`,
});

export const updateStatusSchema = Joi.object({
  favorite: Joi.boolean().required(),
});
