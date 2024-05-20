import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
//register logic
const register = asyncHandler(async (req, res) => {
  const { userName, email, password, confirmPassword } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  if (
    [email, userName, password, confirmPassword].some(
      (field) => field?.trim() === ""
    )
  ) {
    // throw new ApiError(400, "All fields are required");

    return res.status(400).json(new ApiError(400, "All fields are required"));
  }

  if (!(password === confirmPassword)) {
    // throw new ApiError(
    //   400,
    //   " your password is not matched with Confirm Password"
    // );
    return res
      .status(400)
      .json(
        new ApiError(400, " your password is not matched with Confirm Password")
      );
  }
  const existUser = await User.findOne({
    $or: [{ userName }, { email }],
  });

  if (existUser) {
    // throw new ApiError(409, "User with email or username already exists");
    return res
      .status(409)
      .json(new ApiError(409, "User with email or username already exists"));
  }

  const user = await User.create({
    userName,
    email,
    password: hashedPassword,
    confirmPassword,
  });

  const createUser = await User.findById(user._id).select(
    "-password -confirmPassword -createdAt -updatedAt  "
  );
  if (!createUser) {
    // throw new ApiError(500, "something went wrong while registering the user ");
    return res
      .status(500)
      .json(
        new ApiError(500, "something went wrong while registering the user ")
      );
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        createUser,
        token: await createUser.generateToken(),
        userId: createUser._id.toString(),
      },
      "Register Successfully"
    )
  );
});

// login logic
const login = asyncHandler(async (req, res) => {
  const { email, password, userName } = req.body;

  if (!userName && !email) {
    return res
      .status(400)
      .json(new ApiError(400, "username or email is required"));
  }

  const user = await User.findOne({
    $and: [{ password }, { email }],
  });

  if (!user) {
    return res.status(404).json(new ApiError(404, "User does not exist"));
  }

  const createUser = await User.findById(user._id).select(
    "-password -confirmPassword -createdAt -updatedAt  "
  );
  if (!createUser) {
    return res
      .status(500)
      .json(
        new ApiError(500, "something went wrong while registering the user")
      );
  }

  const token = await createUser.generateToken();
  console.log("Token: ", token);

  res.cookie("jwtToken", token, {
    expires: new Date(Date.now() + 25892000000),
    httpOnly: true,
  });
  return res.json(new ApiResponse(200, createUser, "Login successfully"));
});

export { register, login };
