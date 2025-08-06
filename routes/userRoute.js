// routes/userRoutes.js
import express from "express";
import { registerUser, loginUser } from "../controllers/userController.js";
import { body } from "express-validator";

const router = express.Router();

router.post(
  "/register",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Invalid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  registerUser
);
router.post("/login", loginUser);

export default router;
