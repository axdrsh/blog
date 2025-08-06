import Post from "../models/postModel.js";
import { validationResult } from "express-validator";
import asyncHandler from "express-async-handler";

// @desc    create a new post
// @route   post /api/posts
const createPost = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    // Let the errorHandler middleware handle the response format
    throw new Error("validation failed");
  }

  const { title, body } = req.body;

  const post = await Post.create({
    title,
    body,
    user: req.user._id,
  });

  if (post) {
    res.status(201).json(post);
  } else {
    res.status(400);
    throw new Error("invalid post data");
  }
});

// @desc    get all posts
// @route   get /api/posts
const getPosts = asyncHandler(async (req, res) => {
  // get page and limit from query string, with default values
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  // calculate the number of documents to skip
  const skip = (page - 1) * limit;

  // get the total number of posts for calculating total pages
  const totalPosts = await Post.countDocuments();
  const totalPages = Math.ceil(totalPosts / limit);

  const posts = await Post.find({})
    .sort({ createdAt: -1 })
    .limit(limit) // apply the limit
    .skip(skip) // apply the skip
    .populate("user", "name");

  res.status(200).json({
    posts,
    page,
    totalPages,
    totalPosts,
  });
});

// @desc    render a page with all posts
// @route   get /posts
const renderPostsPage = asyncHandler(async (req, res) => {
  // This function is also clean and needs no changes.
  const posts = await Post.find({}).sort({ createdAt: -1 });
  res.render("posts", { posts: posts });
});

// @desc    get a single post by id
// @route   get /api/posts/:id
const getPostById = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id).populate("user", "name");

  if (post) {
    res.status(200).json(post);
  } else {
    // If post is not found, set status and throw an error
    res.status(404);
    throw new Error("post not found");
  }
});

// @desc    update a post
// @route   put /api/posts/:id
const updatePost = asyncHandler(async (req, res) => {
  const updatedPost = await Post.findOneAndUpdate(
    // Find a post with this ID AND owned by this user
    { _id: req.params.id, user: req.user._id },
    req.body,
    { new: true }
  ).populate("user", "name");

  if (updatedPost) {
    res.status(200).json(updatedPost);
  } else {
    // If no post matches the criteria, throw an error
    res.status(404);
    throw new Error("post not found or user not authorized");
  }
});

// @desc    delete a post
// @route   delete /api/posts/:id
const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id, // Combine find and auth check
  });

  if (post) {
    res.status(200).json({ message: "post deleted successfully" });
  } else {
    // If no post matches the criteria, throw an error
    res.status(404);
    throw new Error("post not found or user not authorized");
  }
});

// @desc    upload an image for a post
// @route   post /api/posts/upload
const uploadImage = asyncHandler(async (req, res) => {
  if (req.file) {
    // multer provides the file path after a successful upload
    // we send back the path to the client, which can then be saved
    // to a post document in a separate request.
    res.status(201).json({
      message: "image uploaded successfully",
      imagePath: `/${req.file.path}`,
    });
  } else {
    res.status(400);
    throw new Error("please upload a valid image file");
  }
});

export {
  createPost,
  getPosts,
  renderPostsPage,
  getPostById,
  updatePost,
  deletePost,
  uploadImage,
};
