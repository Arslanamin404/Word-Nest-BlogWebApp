import dotenv from "dotenv";
import express from "express";
import path from "path";
import cookieParser from "cookie-parser";

import userRouter from "./routes/userRoutes.js";
import { connect_mongo_db } from "./config/db_connection.js";
import { db_name } from "./constants/db_name.js";
import { checkForAuthenticationCookie } from "./middlewares/checkAuthCookie.js";
import blogRouter from "./routes/blogRoutes.js";
import { Blog } from "./models/blogModel.js";
import { authorizeRole } from "./middlewares/authorizeRole.js";
import adminRouter from "./routes/adminRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;
// const MONGO_URL = `${process.env.MONGO_DB_URL}/${db_name}`;
const MONGO_CLOUD_URL = `${process.env.MONGO_DB_URL}`;

connect_mongo_db(MONGO_CLOUD_URL);

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.static(path.resolve("./public")));
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(checkForAuthenticationCookie("authToken"));

app.use("/user", userRouter);
app.use("/blog", blogRouter);
app.use("/admin", authorizeRole(["ADMIN"]), adminRouter);

app.get("/", async (req, res) => {
  const allBlogs = await Blog.find({})
    .sort({ updatedAt: -1 })
    .populate("author", "first_name last_name email profile_picture"); // Populate only the 'first name' and 'email' of the author;
  return res.render("home", {
    user: req.user,
    allBlogs,
  });
});

app.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
});
