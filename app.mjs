import express from "express";
import methodOverride from "method-override";
import ejsMate from "ejs-mate";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import { Campground } from "./models/campground.mjs";
//mongo connection
mongoose
  .connect("mongodb://127.0.0.1:27017/yelp-camp")
  .then(() => {
    console.log("mongo connection done from app.mjs");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();
const port = 3000 ?? process.env.port;
const message = () => {
  console.log(`server is open on ${port} port`);
};

//the path and the views
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

//the use methods
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
// express.static();

//the main rout
app.get("/", (req, res) => {
  res.render("index", {
    title: "home",
  });
});

//find all campground
app.get("/campground", async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campground", {
    title: "all campground",
    campgrounds,
  });
});

// create GET
app.get("/campground/new", (req, res) => {
  res.render("new", {
    title: "new",
  });
});

// create POST
app.post("/campground/new", async (req, res) => {
  const newCamp = new Campground(req.body.campground);
  newCamp.save();
  res.redirect(`/campground/${newCamp._id}`);
});

//find by id
app.get("/campground/:id", async (req, res) => {
  const id = req.params.id;
  const idCampground = await Campground.findById(id);
  res.render("details", {
    title: `${idCampground.location}`,
    idCampground,
  });
});

//edit GET
app.get("/campground/:id/edit", async (req, res) => {
  const id = req.params.id;
  const idEditCampground = await Campground.findById(id);
  res.render("edit", {
    title: `Edit ( ${idEditCampground.location} )`,
    idEditCampground,
  });
});

//edit PUT
app.put("/campground/:id/edit", async (req, res) => {
  const id = req.params.id;
  const idEditCampground = await Campground.findByIdAndUpdate(id, {
    ...req.body.campground,
  });
  res.redirect(`/campground/${idEditCampground._id}`);
});

//DELETE BY ID
app.delete("/campground/:id/delete", async (req, res) => {
  const id = req.params.id;
  const idDeleteCampground = await Campground.findByIdAndDelete(id);
  res.redirect("/campground");
});

//the main rout for testing
// app.get("/camp", async (req, res) => {
//   const camp = new Campground({ title: "my Backeard", price: "50" });
//   //   await camp.save();
//   res.render("index", {
//     title: "camp",
//   });
// });

//use error rout
app.use((req, res, next) => {
  res.status(404);
  res.render("error", {
    title: "404",
    pathinfo: req.path,
  });
});

//the listen method
app.listen(port, message);
