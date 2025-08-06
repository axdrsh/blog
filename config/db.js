// config/db.js
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // mongoose.connect returns a promise, so we use await
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`mongodb connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`error connecting to db: ${error.message}`);
    process.exit(1); // exit process with failure
  }
};

export default connectDB;
