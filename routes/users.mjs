import express from "express";
import { catchAsync } from "../utils/catchAsync.mjs";
import passport from "passport";
import {
  renderRegisterForm,
  creatUser,
  renderLogin,
  loginUser,
  logoutUser,
} from "../controllers/user.mjs";
export const userRouter = express.Router();

//for creating a new user with a hashed password
userRouter
  .route("/register")
  .get(renderRegisterForm)
  .post(catchAsync(creatUser));
//login to an existing user by his username and password
userRouter
  .route("/login")
  .get(renderLogin)
  .post(
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
      failureMessage: true,
      keepSessionInfo: true,
    }),
    loginUser
  );
//logout
userRouter.get("/logout", logoutUser);
