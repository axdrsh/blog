// controllers/userController.js
import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";
import { validationResult } from "express-validator";
import asyncHandler from "express-async-handler";

// @desc    register a new user
// @route   post /api/users/register

// wrap the function in asyncHandler
const registerUser = asyncHandler(async (req, res) => {
  // ... validation ...
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400); // set status code
    throw new Error("user already exists"); // throw an error instead of sending a response
  }

  const user = await User.create({ name, email, password });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("invalid user data");
  }
});

// @desc    auth user & get token
// @route   post /api/users/login
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("invalid email or password");
  }
});

export { registerUser, loginUser };
