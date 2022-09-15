import { Campground } from "../models/campground.mjs";

export const index = async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campground", {
    title: "all campground",
    campgrounds,
  });
};
export const renderCreateCampground = (req, res) => {
  res.render("new", {
    title: "new",
  });
};
export const creatCampground = async (req, res, next) => {
  const campground = new Campground(req.body.campground);
  campground.imgs = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));

  campground.author = req.user._id;
  await campground.save();
  console.log(campground);
  req.flash("suc", `${campground.location} Successfully created`);
  res.redirect(`/campground/${campground._id}`);
};

export const showCampround = async (req, res) => {
  const id = req.params.id;
  const campground = await Campground.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("author");
  if (!campground) {
    req.flash("error", `Campground with th id: ${id} Dose not exsist`);
    return res.redirect("/campground");
  }
  // res.json(idCampground);
  res.render("details", {
    title: `${campground.location}`,
    campground,
  });
};
export const renderEditForm = async (req, res) => {
  const id = req.params.id;
  const campground = await Campground.findById(id).populate("author");
  if (!campground) {
    req.flash("error", `Campground with th id: ${id} Dose not exsist`);
    return res.redirect("/campground");
  }
  res.render("edit", {
    title: `Edit ( ${campground.location} )`,
    campground,
  });
};

export const updateCampground = async (req, res) => {
  const id = req.params.id;
  const campground = await Campground.findByIdAndUpdate(id, {
    ...req.body.campground,
  });
  req.flash("suc", `${campground.location} Successfully edited`);
  res.redirect(`/campground/${campground._id}`);
};
export const deleteCampground = async (req, res) => {
  const id = req.params.id;
  const campground = await Campground.findByIdAndDelete(id);
  req.flash("suc", `${campground.location} Successfully deleted`);
  res.redirect("/campground");
};
