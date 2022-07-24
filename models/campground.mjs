import mongoose from "mongoose";

const Schema = mongoose.Schema;
const campgroundSchema = new Schema({
  title: {
    type: String,
  },
  price: {
    type: Number,
  },
  description: {
    type: String,
  },
  location: {
    type: String,
  },
  number: {
    type: Number,
  },
  img: {
    type: String,
  },
});
export const Campground = mongoose.model("Campground", campgroundSchema);
