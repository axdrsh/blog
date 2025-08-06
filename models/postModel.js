// models/postModel.js
import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    // this is the new field
    user: {
      type: mongoose.Schema.Types.ObjectId, // this stores a mongodb document id
      required: true,
      ref: "User", // this tells mongoose the id belongs to a document in the 'User' collection
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    body: {
      type: String,
      required: true,
    },
    coverImage: {
      type: String, // just a string for the path
      required: false, // not every post needs an image
    },
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model("Post", postSchema);
export default Post;
