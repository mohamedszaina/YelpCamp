import * as dotenv from "dotenv";
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
  console.log(
    "\nCLOUDINARY_name:",
    process.env.CLOUDINARY_CLOUD_NAME,
    "\nCLOUDINARY_key:",
    process.env.CLOUDINARY_KEY,
    "\nCLOUDINARY_secret:",
    process.env.CLOUDINARY_SECRET,
    "\n"
  );
}
import express from "express";
import methodOverride from "method-override";
import ejsMate from "ejs-mate";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import { expressError } from "./utils/expressError.mjs";
import { campgroundRoutes } from "./routes/campgrounds.mjs";
import { reviewsRoutes } from "./routes/reviews.mjs";
import session from "express-session";
import flash from "connect-flash";
import passport from "passport";
import LocalSrtategy from "passport-local";
import { User } from "./models/user.mjs";
import { userRouter } from "./routes/users.mjs";

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
const sessionConfig = {
  secret: "zaina",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
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
app.use(express.static(path.join(__dirname, "/public")));
app.use(session(sessionConfig));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalSrtategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(flash());
app.use((req, res, next) => {
  req.session;
  res.locals.currentUser = req.user;
  res.locals.suc = req.flash("suc");
  res.locals.error = req.flash("error");
  next();
});

app.use("/", userRouter);
app.use("/campground", campgroundRoutes);
app.use("/campground/:id/reviews", reviewsRoutes);

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
