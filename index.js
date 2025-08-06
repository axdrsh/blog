// import express
import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import ejs from "ejs";
import blogRoute from "./routes/blogRoute.js";
import userRoute from "./routes/userRoute.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import path from "path";
import { fileURLToPath } from "url";

// load environment variables from .env file
dotenv.config();

// connect to the database
connectDB();

const app = express();
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// set up ejs as the view engine
app.set("view engine", "ejs");

// middleware to parse JSON bodies
app.use(express.json());

// use the blogRoute for all routes that start with /
app.use("/", blogRoute);
app.use("/api/users", userRoute);

// set up static file serving for the uploads directory
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// use the error middleware
app.use(notFound);
app.use(errorHandler);

// listen for requests on the port
app.listen(port, () => {
  console.log(`server is listening on http://localhost:${port}`);
});
