// middleware/errorMiddleware.js

// handles routes that don't exist
const notFound = (req, res, next) => {
  const error = new Error(`not found - ${req.originalUrl}`);
  res.status(404);
  next(error); // pass the error to the next middleware
};

// handles all other errors
// this is a special express middleware because it has 4 arguments
const errorHandler = (err, req, res, next) => {
  // if the status code is still 200, make it 500 (server error)
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  res.status(statusCode).json({
    message: message,
    // show the error stack only if we're not in production
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

export { notFound, errorHandler };
