import joi from "joi";

export const joiCampgroundSchema = joi.object({
  campground: joi
    .object({
      title: joi.string().required(),
      price: joi.number().required().min(0),
      description: joi.string().required(),
      location: joi.string().required(),
      img: joi.string().required(),
    })
    .required(),
});
