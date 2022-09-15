import joi from "joi";

export const joiCampgroundSchema = joi.object({
  campground: joi
    .object({
      title: joi.string().required(),
      price: joi.number().required().min(0),
      description: joi.string().required(),
      location: joi.string().required(),
      // imgs: joi.object({
      //   url: joi.string().required(),
      //   filename: joi.string().required(),
      // }),
    })
    .required(),
});

export const joiReviewSchema = joi.object({
  review: joi
    .object({
      body: joi.string().required(),
      rating: joi.number().required().min(1).max(5),
    })
    .required(),
});
