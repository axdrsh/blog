// middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const protect = async (req, res, next) => {
  let token;

  // tokens are sent in the authorization header like: Bearer <token>
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // get token from header
      token = req.headers.authorization.split(" ")[1]; // splits 'Bearer <token>' into an array and gets the token part

      // verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // get user from the token's payload (the user id we stored in it)
      // and attach the user object to the request, but without the password
      req.user = await User.findById(decoded.id).select("-password");

      next(); // move on to the next step (the actual controller)
    } catch (error) {
      res.status(401).json({ message: "not authorized, token failed" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "not authorized, no token" });
  }
};

export { protect };
