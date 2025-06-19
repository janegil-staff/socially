import createHttpError from "http-errors";
import validator from "validator";
import bcrypt from "bcrypt";
import { UserModel } from "../models/index.js";
import cloudinary from "../configs/cloudinary.config.js";

//env variables
const { DEFAULT_PICTURE, DEFAULT_STATUS } = process.env;

export const createUser = async (userData) => {
    console.log(userData);
  const { userName, email, image, status, password } = userData;

  //check if fields are empty
  if (!userName || !email || !password) {
    throw createHttpError.BadRequest("Please fill all fields.");
  }

  //check name length
  if (
    !validator.isLength(userName, {
      min: 2,
      max: 25,
    })
  ) {
    throw createHttpError.BadRequest(
      "Plase make sure your name is between 2 and 16 characters."
    );
  }

  //Check status length
  if (status && status.length > 64) {
    throw createHttpError.BadRequest(
      "Please make sure your status is less than 64 characters."
    );
  }

  //check if email address is valid
  if (!validator.isEmail(email)) {
    throw createHttpError.BadRequest(
      "Please make sure to provide a valid email address."
    );
  }

  //check if user already exist
  const checkDb = await UserModel.findOne({ email });
  if (checkDb) {
    throw createHttpError.Conflict(
      "Please try again with a different email address, this email already exist."
    );
  }

  //check password length
  if (
    !validator.isLength(password, {
      min: 6,
      max: 128,
    })
  ) {
    throw createHttpError.BadRequest(
      "Please make sure your password is between 6 and 128 characters."
    );
  }
  let picture;
  if (image) {
    // base64 format
    if (image.startsWith("data:image")) {
      try {
        const uploadResponse = await cloudinary.uploader.upload(image, {
          folder: "chatter"
        });
        picture = uploadResponse.secure_url;
        console.log(picture);
      } catch (error) {
        console.error("Error uploading image:", error);

        return res.status(400).json({
          success: false,
          message: "Error uploading image",
        });
      }
    }
  }
  //hash password--->to be done in the user model

  //adding user to databse
  const user = await new UserModel({
    userName,
    email,
    picture: picture || DEFAULT_PICTURE,
    status: status || DEFAULT_STATUS,
    password,
  }).save();

  return user;
};

export const signUser = async (email, password) => {
  const user = await UserModel.findOne({ email: email.toLowerCase() }).lean();

  //check if user exist
  if (!user) throw createHttpError.NotFound("Invalid credentials.");

  //compare passwords
  let passwordMatches = await bcrypt.compare(password, user.password);

  if (!passwordMatches) throw createHttpError.NotFound("Invalid credentials.");

  return user;
};
