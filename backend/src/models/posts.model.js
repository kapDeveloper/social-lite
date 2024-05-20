import mongoose, { Schema } from "mongoose";
const postsSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    img: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Posts = mongoose.model("Posts", postsSchema);
