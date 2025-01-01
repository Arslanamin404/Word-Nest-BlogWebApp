import express from "express";
import {
  handle_render_user_profile,
  handle_update_user_profile,
  handle_user_logout,
  handle_user_signin,
  handle_user_signup,
} from "../controllers/userController.js";
import { upload } from "../utils/multerConfig.js";

const userRouter = express.Router();

userRouter.get("/signup", (req, res) => {
  return res.render("signup");
});

userRouter.get("/signin", (req, res) => {
  return res.render("signin");
});

userRouter.post("/signup", handle_user_signup);
userRouter.post("/signin", handle_user_signin);
userRouter.get("/logout", handle_user_logout);
userRouter.get("/profile", handle_render_user_profile);

// update profile
userRouter.post(
  "/profile/update",
  upload.single("profile_picture"),
  handle_update_user_profile
);

export default userRouter;
