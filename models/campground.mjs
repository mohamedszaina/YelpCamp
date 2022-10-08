import mongoose from "mongoose";
import { Review } from "./review.mjs";
const opts = { toJSON: { virtuals: true } }; //to stringify the data in mongoose

const Schema = mongoose.Schema;

const imageSchema = new Schema({
  url: String,
  filename: String,
});
imageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("upload", "upload/w_135");
});
const campgroundSchema = new Schema(
  {
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
    geometry: {
      type: {
        type: String,
        enum: ["Point"], // 'geometry.type' must be 'Point'
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    number: {
      type: Number,
    },
    imgs: [imageSchema],
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
  },
  opts
);
campgroundSchema.virtual("properties.popUpMarkup").get(function () {
  return `
  <strong>
  <a href='/campground/${this._id}'>${this.title}</a>
  <div><p>longitude , latitude</p>
  <p>${this.geometry.coordinates}</p></div>
  <p>${this.description.substring(0, 35)}...</p>
  </strong>`;
});
campgroundSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews,
      },
    });
  }
});
export const Campground = mongoose.model("Campground", campgroundSchema);
