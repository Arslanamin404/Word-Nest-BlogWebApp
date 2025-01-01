import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import { Blog } from "./blogModel.js";
import { Comment } from "./commentModel.js";

const { isEmail } = validator;

const userSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: [true, "first name is required"],
    },
    last_name: {
      type: String,
      required: [true, "last name is required"],
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: [true, "email already registered"],
      lowercase: true,
      validate: [isEmail, "please enter a valid email address"],
    },
    password: {
      type: String,
      required: [true, "password is required"],
    },
    profile_picture: {
      type: String,
      default: "/images/default.png",
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
  },
  { timestamps: true }
);

// hash password before saving user to db
userSchema.pre("save", async function (next) {
  const user = this;

  // Only hash the password if it has been modified or is new
  if (!user.isModified("password")) {
    return next();
  }

  const hashedPassword = await bcrypt.hash(user.password, 10);
  user.password = hashedPassword;

  next();
});

// Custom function to handle user deletion and cascade-delete related blogs
userSchema.methods.cascadeDelete = async function () {
  try {
    // Delete all blogs by this user
    await Blog.deleteMany({ author: this._id });

    // Delete all comments authored by the user
    await Comment.deleteMany({ author: this._id });

    // Finally, delete the user
    await this.deleteOne();
  } catch (err) {
    console.log(err.message);
  }
};

export const User = new mongoose.model("User", userSchema);
