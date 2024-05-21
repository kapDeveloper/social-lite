import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Posts } from "../models/posts.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const sendPosts = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  if ([title, description].some((field) => field?.trim() === "")) {
    return res.status(400).json(new ApiError(400, "All fields are required"));
  }

  console.log("Files", req.files);
  let imgLocalPath;
  if (req.files && Array.isArray(req.files.img) && req.files.img.length > 0) {
    imgLocalPath = req.files.img[0].path;
  }
  const img = await uploadOnCloudinary(imgLocalPath);

  if (!img) {
    return res.status(400).json(new ApiError(400, "Img file are required"));
  }

  const posts = await Posts.create({
    title,
    img: img?.url,
    description,
  });

  await posts.save();

  const createPost = await Posts.findById(posts._id).select("");

  if (!createPost) {
    return res
      .status(500)
      .json(new ApiError(500, "Something went wrong while sending post"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, createPost, "post sent successfully"));
});

//edit post
const editPosts = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  if (!title && !description) {
    return res.status(400).json(new ApiError(400, "All Fields are required"));
  }

  // const findPost=Posts.()

  //
  const imgLocalPath = req.file?.path;

  // validate at user
  if (!imgLocalPath) {
    return res.status(400).json(new ApiError(400, "image file is missing"));
  }

  // upload it on clodinary
  const img = await uploadOnCloudinary(imgLocalPath);

  if (!img.url) {
    return res
      .status(400)
      .json(new ApiError(400, "Error while uploading on image"));
  }

  // now update

  const postId = req.params.id;
  const query = {
    _id: postId,
  };
  console.log(postId);
  const posts = await Posts.findOneAndUpdate(
    query,
    {
      $set: { title, description, img: img.url },
    },
    { new: true }
  ).select("");

  if (!posts) {
    return res.status(400).json(new ApiError(400, "Post not found"));
  }
  return res
    .status(200)
    .json(new ApiResponse(200, posts, "post edited successfully"));
});

const deletePosts = asyncHandler(async (req, res) => {
  const posts = await Posts.findByIdAndDelete(req.params.id);

  if (!posts) {
    return res.status(400).json(new ApiError(400, "Post not found"));
  }

  // await posts.remove();

  return res
    .status(200)
    .json(new ApiResponse(200, "post deleted successfully"));
});

const getPosts = asyncHandler(async (req, res) => {
  const posts = await Posts.find();

  return res
    .status(200)
    .json(new ApiResponse(200, posts, "post received successfully"));
});

const getEditPost = asyncHandler(async (req, res) => {
  const editPost = await Posts.findById(req.params.id);

  if (!editPost) {
    return res.status(400).json(new ApiError(400, "Post not found"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, editPost, "post edit get successfully"));
});
export { sendPosts, deletePosts, editPosts, getPosts, getEditPost };

// http://res.cloudinary.com/kapdev/image/upload/v1715839415/pehbwuybctwlyn8cq0pg.jpg
// http://res.cloudinary.com/kapdev/image/upload/v1715839415/pehbwuybctwlyn8cq0pg.jpg
// http://res.cloudinary.com/kapdev/image/upload/v1715839415/pehbwuybctwlyn8cq0pg.jpg
