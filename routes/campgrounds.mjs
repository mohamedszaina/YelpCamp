import express from "express";
import { catchAsync } from "../utils/catchAsync.mjs";
import { isAuthor, isLoggedIn, validateCampground } from "../middleware.mjs";
import {
  index,
  renderCreateCampground,
  creatCampground,
  showCampround,
  renderEditForm,
  updateCampground,
  deleteCampground,
} from "../controllers/campground.mjs";
import multer from "multer";
import { storage } from "../cloudinary/index.mjs";

export const campgroundRoutes = express.Router();

const upload = multer({ storage });

campgroundRoutes
  .route("/")
  .get(catchAsync(index))
  .post(
    isLoggedIn,
    upload.array("img"),
    validateCampground,
    catchAsync(creatCampground)
  );

campgroundRoutes.get("/new", isLoggedIn, renderCreateCampground);

campgroundRoutes.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(renderEditForm)
);
campgroundRoutes
  .route("/:id")
  .get(catchAsync(showCampround))
  .put(
    isLoggedIn,
    isAuthor,
    upload.array("img"),
    validateCampground,
    catchAsync(updateCampground)
  )
  .delete(isLoggedIn, isAuthor, catchAsync(deleteCampground));
