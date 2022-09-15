import { Campground } from "./models/campground.mjs";
import { joiCampgroundSchema } from "./validateschema.mjs";
import { expressError } from "./utils/expressError.mjs";

export const validateCampground = (req, res, next) => {
  const { error } = joiCampgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new expressError(msg, 400);
  } else {
    next();
  }
};

export const isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    const { id } = req.params;
    req.session.returnTo = !req.query._method
      ? req.originalUrl
      : `/campground/${id}`;
    req.flash("error", "You must be signed in first!");
    return res.redirect("/login");
  }
  next();
};

export const isAuthor = async (req, res, next) => {
  const id = req.params.id;
  const campground = await Campground.findById(id).populate("author");
  if (!campground.author.equals(req.user._id)) {
    req.flash(
      "error",
      `You can not do that! you are not ${campground.author.username}`
    );
    return res.redirect(`/campground/${id}`);
  }
  next();
};
