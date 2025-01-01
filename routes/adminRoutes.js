import express from "express";
import { upload } from "../utils/multerConfig.js";
import {
  handle_delete_user,
  handle_render_editBlog,
  handle_edit_user,
  handle_render_allBlogs,
  handle_render_allUsers,
  handle_render_dashboard,
  handle_render_userToEdit,
  handle_delete_blog,
  handle_edit_blog,
} from "../controllers/adminController.js";
import { handleViewBlog } from "../controllers/blogController.js";

const adminRouter = express.Router();

adminRouter.get("/dashboard", handle_render_dashboard);
adminRouter.get("/users", handle_render_allUsers);
adminRouter.get("/blogs", handle_render_allBlogs);
adminRouter.get("/users/edit/:id", handle_render_userToEdit);

adminRouter.post(
  "/users/edit/:id",
  upload.single("profile_picture"),
  handle_edit_user
);
adminRouter.post("/users/delete/:id", handle_delete_user);

adminRouter.get("/blogs/view/:id", handleViewBlog);
adminRouter.get("/blogs/edit/:id", handle_render_editBlog);

adminRouter.post(
  "/blogs/edit/:id",
  upload.single("coverImage"),
  handle_edit_blog
);
adminRouter.post("/blogs/delete/:id", handle_delete_blog);

export default adminRouter;
