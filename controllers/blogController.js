import { Blog } from "../models/blogModel.js";
import { Comment } from "../models/commentModel.js";

export const handleAddBlog = async (req, res) => {
  try {
    const { title, content } = req.body;

    // Check if file is provided
    const coverImage = req.file
      ? `/uploads/${req.file.filename}`
      : "/uploads/defaultBlogCoverImage.png";

    const new_blog = await Blog.create({
      title,
      content,
      coverImage,
      author: req.user._id,
    });
    return res.redirect(`/blog/${new_blog._id}`);
  } catch (error) {
    console.error("Error adding blog:", error.message);
  }
};

export const handleViewBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    const blog = await Blog.findById(blogId).populate(
      "author",
      "first_name last_name email profile_picture"
    );
    const comments = await Comment.find({ blogId }).populate(
      "author",
      "_id first_name last_name email profile_picture"
    );
    return res.render("blog", {
      blog,
      user: req.user,
      comments,
    });
  } catch (error) {
    console.error("Error viewing blog:", error.message);
  }
};

export const handleAddComment = async (req, res) => {
  try {
    await Comment.create({
      text: req.body.text,
      author: req.user._id,
      blogId: req.params.blogId,
    });
    return res.redirect(`/blog/${req.params.blogId}`);
  } catch (error) {
    console.error("Error adding comment:", error.message);
  }
};

export const handleDeleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findByIdAndDelete(commentId);

    return res.redirect(`/blog/${comment.blogId}`);
  } catch (error) {
    console.error("Error occurred while deleting comment:", error.message);
    return res.redirect(`/`); // Redirect to homepage or appropriate error page
  }
};
