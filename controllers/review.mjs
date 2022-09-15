import { Review } from "../models/review.mjs";
import { Campground } from "../models/campground.mjs";

export const createReview = async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  const newReview = new Review(req.body.review);
  newReview.author = req.user._id;
  campground.reviews.push(newReview);
  await newReview.save();
  await campground.save();
  req.flash("suc", "Successfully made a new review");
  res.redirect(`/campground/${campground._id}`);
};
export const deleteReview = async (req, res) => {
  const { id, idReview } = req.params;
  await Campground.findByIdAndUpdate(id, { $pull: { reviews: idReview } });
  await Review.findByIdAndDelete(idReview);
  req.flash("suc", "Successfully deleted");
  res.redirect(`/campground/${id}`);
};
