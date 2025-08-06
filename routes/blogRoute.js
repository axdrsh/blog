// routes/blogRoutes.js
import express from "express";
import {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
} from "../controllers/blogController.js";
import { protect } from "../middleware/authMiddleware.js"; // import the middleware
import { body } from "express-validator";
import upload from "../config/uploadConfig.js"; // import our upload config
import { uploadImage } from "../controllers/blogController.js"; // we will create this controller next

const router = express.Router();

// to protect a route, just add the 'protect' middleware before the controller function
router.post(
  "/api/posts",
  protect,
  [
    body("title", "title is required").not().isEmpty(),
    body("body", "body is required").not().isEmpty(),
  ],
  createPost
);
router.put("/api/posts/:id", protect, updatePost);
router.delete("/api/posts/:id", protect, deletePost);

// these routes can remain public
router.get("/api/posts", getPosts);
router.get("/api/posts/:id", getPostById);

// new route for file uploads. note 'protect' runs first, then 'upload'.
router.post("/api/posts/upload", protect, upload, uploadImage);

// ... we can remove the web view route for now to focus on the api
// router.get('/posts', renderPostsPage);

export default router;
