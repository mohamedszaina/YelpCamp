import { User } from "../models/user.mjs";
export const renderRegisterForm = (req, res) => {
  res.render("users/register", {
    title: "Register",
  });
};
export const creatUser = async (req, res) => {
  // Handling the errors that might comes in the user registration controller
  try {
    const { username, email, password } = req.body;
    const newUser = new User({ username, email });
    const userRegister = await User.register(newUser, password);
    req.login(userRegister, (err) => {
      if (err) {
        return next(err);
      } else {
        req.flash("suc", "Successfully Registered & Now you're loggedIn");
        res.redirect("/campground/");
      }
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/register");
  }
};
export const renderLogin = (req, res) => {
  res.render("users/login", {
    title: "login",
  });
};
export const loginUser = (req, res) => {
  req.flash("suc", `Welcome back! ${req.session.passport.user}`);
  const currentUrl = req.session.returnTo || "/";
  delete req.session.returnTo;
  res.redirect(currentUrl);
};
export const logoutUser = (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("suc", "Goodbye!");
    res.redirect("/login");
  });
};
