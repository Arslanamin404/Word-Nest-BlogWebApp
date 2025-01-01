import express from "express";
import {
  handleAddBlog,
  handleViewBlog,
  handleAddComment,
  handleDeleteComment,
} from "../controllers/blogController.js";
import { upload } from "../utils/multerConfig.js";

const blogRouter = express.Router();

blogRouter.get("/add-blog", (req, res) => {
  return res.render("addBlog", {
    user: req.user,
  });
});
blogRouter.post("/add-blog", upload.single("coverImage"), handleAddBlog);

blogRouter.get("/:id", handleViewBlog);
blogRouter.post("/comment/:blogId", handleAddComment);
blogRouter.post("/comment/delete/:commentId", handleDeleteComment);

export default blogRouter;
