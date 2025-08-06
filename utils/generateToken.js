// utils/generateToken.js
import jwt from "jsonwebtoken";

const generateToken = (id) => {
  // jwt.sign() creates the token
  // it takes the payload (data to store), the secret, and options
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d", // token expires in 30 days
  });
};

export default generateToken;
