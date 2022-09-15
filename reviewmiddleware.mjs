import { joiReviewSchema } from "./validateschema.mjs";
import { expressError } from "./utils/expressError.mjs";
import { Review } from "./models/review.mjs";

export const validateReview = (req, res, next) => {
  const { error } = joiReviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new expressError(msg, 400);
  } else {
    next();
  }
};
export const isAuthorReview = async (req, res, next) => {
  const { id, idReview } = req.params;
  const review = await Review.findById(idReview).populate("author");
  if (!review.author.equals(req.user._id)) {
    req.flash(
      "error",
      `You can not do that! you are not ${review.author.username}`
    );
    return res.redirect(`/campground/${id}`);
  }
  next();
};
