import express from "express";
import methodOverride from "method-override";
import ejsMate from "ejs-mate";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import { expressError } from "./utils/expressError.mjs";
import { campgroundRoutes } from "./routes/campgrounds.mjs";
import { reviewsRoutes } from "./routes/reviews.mjs";
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
app.use("/campground", campgroundRoutes);
app.use("/campground", reviewsRoutes);
// express.static();

//the main rout
app.get("/", (req, res) => {
  res.render("index", {
    title: "home",
  });
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
app.all("*", (req, res, next) => {
  next(new expressError("page not found", 404));
});
app.use((err, req, res, next) => {
  const { statuscode = 500 } = err;
  if (!err.message) err.message = "something went wrong!!!";
  res.status(statuscode).render("error", {
    title: "Error",
    pathinfo: req.path,
    err,
  });
});

//the listen method
app.listen(port, message);
