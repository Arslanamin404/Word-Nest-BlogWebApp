import { User } from "../models/userModel.js";
import { Blog } from "../models/blogModel.js";
import { Comment } from "../models/commentModel.js";

export const handle_render_dashboard = async (req, res) => {
  const users = await User.find();
  const posts = await Blog.find();
  const comments = await Comment.find();

  return res.render("admin/dashboard", {
    userLength: users.length,
    postLength: posts.length,
    commentLength: comments.length,
    user: req.user,
  });
};

export const handle_render_allUsers = async (req, res) => {
  const allUsers = await User.find();
  return res.render("admin/users", {
    user: req.user,
    allUsers,
  });
};

export const handle_render_allBlogs = async (req, res) => {
  const allBlogs = await Blog.find().populate("author", "first_name last_name");
  return res.render("admin/blogs", {
    user: req.user,
    allBlogs,
  });
};

export const handle_render_userToEdit = async (req, res) => {
  const userToEdit = await User.findById(req.params.id);
  return res.render("admin/editUser", {
    user: req.user,
    userToEdit,
  });
};

export const handle_edit_user = async (req, res) => {
  try {
    const userToEdit = await User.findById(req.params.id);
    const { first_name, last_name, email, role } = req.body;
    const profile_picture = req.file ? `/uploads/${req.file.filename}` : null;

    if (first_name) {
      userToEdit.first_name = first_name;
    }

    if (last_name) {
      userToEdit.last_name = last_name;
    }

    if (email) {
      userToEdit.email = email;
    }

    if (role) {
      userToEdit.role = role;
    }
    if (profile_picture) {
      userToEdit.profile_picture = profile_picture;
    }
    await userToEdit.save();
    return res.redirect(`/admin/users`);
  } catch (error) {
    console.error(
      `Error occurred while admin updating profile: ${error.message}`
    );
    return res.redirect(`/admin/users`);
  }
};

export const handle_delete_user = async (req, res) => {
  try {
    const userToDelete = await User.findById(req.params.id);
    await userToDelete.cascadeDelete(); // Trigger the custom delete function
    return res.redirect(`/admin/users`);
  } catch (error) {
    console.error(`Error occurred while admin deleting user: ${error.message}`);
    return res.redirect(`/admin/users`);
  }
};

export const handle_render_editBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    return res.render("admin/editBlog", {
      user: req.user,
      blog,
    });
  } catch (error) {
    console.error("Error viewing blog:", error.message);
  }
};

export const handle_edit_blog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    const { title, content } = req.body;
    const coverImage = req.file ? `/uploads/${req.file.filename}` : null;

    if (title) {
      blog.title = title;
    }

    if (content) {
      blog.content = content;
    }

    if (coverImage) {
      blog.coverImage = coverImage;
    }
    await blog.save();
    return res.redirect(`/admin/blogs`);
  } catch (error) {
    console.error(`Error occurred while admin deleting user: ${error.message}`);
    return res.redirect(`/admin/blogs`);
  }
};

export const handle_delete_blog = async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    return res.redirect(`/admin/blogs`);
  } catch (error) {
    console.error(`Error occurred while admin deleting user: ${error.message}`);
    return res.redirect(`/admin/blogs`);
  }
};
