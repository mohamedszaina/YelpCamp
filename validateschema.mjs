import BaseJoi from "joi";
import sanitizeHtml from "sanitize-html";

const extension = (Joi) => ({
  type: "string",
  base: Joi.string(),
  messages: {
    "string.escapeHTML": "{{#label}} must not include HTML!",
  },
  rules: {
    escapeHTML: {
      validate(value, helpers) {
        const clean = sanitizeHtml(value, {
          allowedTags: [],
          allowedAttributes: {},
        });
        if (clean !== value)
          return helpers.error("string.escapeHTML", { value });
        return clean;
      },
    },
  },
});

const joi = BaseJoi.extend(extension);

export const joiCampgroundSchema = joi.object({
  campground: joi
    .object({
      title: joi.string().required().escapeHTML(),
      price: joi.number().required().min(0),
      description: joi.string().required().escapeHTML(),
      location: joi.string().required().escapeHTML(),
    })
    .required(),
  deleteImages: joi.array(),
});

export const joiReviewSchema = joi.object({
  review: joi
    .object({
      body: joi.string().required().escapeHTML(),
      rating: joi.number().required().min(1).max(5),
    })
    .required(),
});
