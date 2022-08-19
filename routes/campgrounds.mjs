import express from "express";
import { Campground } from "../models/campground.mjs";
import { catchAsync } from "../utils/catchAsync.mjs";
import { expressError } from "../utils/expressError.mjs";
import { joiCampgroundSchema } from "../validateschema.mjs";

export const campgroundRoutes = express.Router();
const validateCampground = (req, res, next) => {
  const { error } = joiCampgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new expressError(msg, 400);
  } else {
    next();
  }
};
//find all campground
campgroundRoutes.get(
  "/",
  catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campground", {
      title: "all campground",
      campgrounds,
    });
  })
);

// create GET
campgroundRoutes.get("/new", (req, res) => {
  res.render("new", {
    title: "new",
  });
});

// create POST
campgroundRoutes.post(
  "/new",
  validateCampground,
  catchAsync(async (req, res, next) => {
    const newCamp = new Campground(req.body.campground);
    await newCamp.save();
    res.redirect(`/campground/${newCamp._id}`);
  })
);

//find by id
campgroundRoutes.get(
  "/:id",
  catchAsync(async (req, res) => {
    const id = req.params.id;
    const idCampground = await Campground.findById(id).populate("reviews");
    // res.json(idCampground);
    res.render("details", {
      title: `${idCampground.location}`,
      idCampground,
    });
  })
);

//edit GET
campgroundRoutes.get(
  "/:id/edit",
  catchAsync(async (req, res) => {
    const id = req.params.id;
    const idEditCampground = await Campground.findById(id);
    res.render("edit", {
      title: `Edit ( ${idEditCampground.location} )`,
      idEditCampground,
    });
  })
);

//edit PUT
campgroundRoutes.put(
  "/:id/edit",
  validateCampground,
  catchAsync(async (req, res) => {
    const id = req.params.id;
    const idEditCampground = await Campground.findByIdAndUpdate(id, {
      ...req.body.campground,
    });
    res.redirect(`/campground/${idEditCampground._id}`);
  })
);

//DELETE BY ID
campgroundRoutes.delete(
  "/:id/delete",
  catchAsync(async (req, res) => {
    const id = req.params.id;
    const idDeleteCampground = await Campground.findByIdAndDelete(id);
    res.redirect("/campground");
  })
);
