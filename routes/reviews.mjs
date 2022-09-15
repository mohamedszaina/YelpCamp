import express from "express";
import { catchAsync } from "../utils/catchAsync.mjs";
import { isLoggedIn } from "../middleware.mjs";
import { validateReview, isAuthorReview } from "../reviewmiddleware.mjs";
import { createReview, deleteReview } from "../controllers/review.mjs";
export const reviewsRoutes = express.Router({ mergeParams: true });

// Adding reviews to a specific campground
reviewsRoutes.post("/", isLoggedIn, validateReview, catchAsync(createReview));
// Deleting reviews to a specific campground
reviewsRoutes.delete(
  "/:idReview",
  isLoggedIn,
  isAuthorReview,
  catchAsync(deleteReview)
);
