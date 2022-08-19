import express from "express";
import { catchAsync } from "../utils/catchAsync.mjs";
import { expressError } from "../utils/expressError.mjs";
import { joiReviewSchema } from "../validateschema.mjs";
import { Review } from "../models/review.mjs";
import { Campground } from "../models/campground.mjs";

export const reviewsRoutes = express.Router();
const validateReview = (req, res, next) => {
  const { error } = joiReviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new expressError(msg, 400);
  } else {
    next();
  }
};

// Adding reviews to a specific campground
reviewsRoutes.post(
  "/:id/reviews",
  validateReview,
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const newReview = new Review(req.body.review);
    campground.reviews.push(newReview);
    await newReview.save();
    await campground.save();
    res.redirect(`/campground/${campground._id}`);
  })
);
reviewsRoutes.delete(
  "/:id/reviews/:idReview",
  catchAsync(async (req, res) => {
    const { id, idReview } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: idReview } });
    await Review.findByIdAndDelete(idReview);
    res.redirect(`/campground/${id}`);
  })
);
