import { User } from "../models/userModel.js";
import { createTokenForUser } from "../services/authService.js";
import bcrypt from "bcrypt";

export const handle_user_signup = async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;
    const new_user = await User.create({
      first_name,
      last_name,
      email,
      password,
    });
    const token = createTokenForUser(new_user);
    res
      .cookie("authToken", token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
        // sameSite: "strict",
      })
      .redirect("/");
  } catch (error) {
    return res.render("signup", { error: error.message });
  }
};

export const handle_user_signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("Invalid Credentials");
    }

    const is_validPassword = await bcrypt.compare(password, user.password);
    if (!is_validPassword) {
      throw new Error("Invalid Credentials");
    }

    const authToken = createTokenForUser(user);
    res.cookie("authToken", authToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
      // sameSite: "strict",
    });
    return res.redirect("/");
  } catch (error) {
    return res.render("signin", { error: error.message });
  }
};

export const handle_user_logout = (req, res) => {
  res.clearCookie("authToken");
  return res.redirect("/");
};

export const handle_render_user_profile = async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  return res.render("profile", { user });
};

export const handle_update_user_profile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const { first_name, last_name, email } = req.body;
    const profile_picture = req.file ? `/uploads/${req.file.filename}` : null;

    if (first_name) {
      user.first_name = first_name;
    }

    if (last_name) {
      user.last_name = last_name;
    }

    if (email) {
      user.email = email;
    }
    if (profile_picture) {
      user.profile_picture = profile_picture;
    }
    await user.save();
    return res.redirect("/user/profile");
  } catch (error) {
    console.error(`error occurred while updating profile: ${error.message}`);
    return res.redirect("/user/profile", { error: error.message });
  }
};
