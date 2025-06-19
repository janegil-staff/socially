import formidable from "formidable";
import validator from "validator";
import registerModel from "../models/user.model.js";
import fs from "fs";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cloudinary from "../configs/cloudinary.config.js";

export const userRegister = (req, res) => {
  const form = formidable();
  form.parse(req, async (err, fields, files) => {
    let { userName, email, password, confirmPassword } = fields;
    userName = userName.toString();
    email = email.toString();
    password = password.toString();
    confirmPassword = confirmPassword.toString();

    const { image } = files;
    const error = [];
    console.log(image);
    if (!userName) {
      error.push("Please provide your user name");
    }
    if (!email) {
      error.push("Please provide your Email");
    }
    if (email && !validator.isEmail(email)) {
      error.push("Please provide your Valid Email");
    }
    if (!password) {
      error.push("Please provide your Password");
    }
    if (!confirmPassword) {
      error.push("Please provide your confirm Password");
    }
    if (password && confirmPassword && password !== confirmPassword) {
      error.push("Your Password and Confirm Password not same");
    }
    if (password && password.length < 6) {
      error.push("Please provide password mush be 6 charecter");
    }
    if (error.length > 0) {
      res.status(400).json({
        error: {
          errorMessage: error,
        },
      });
    } else {
      try {
        const checkUser = await registerModel.findOne({
          email: email,
        });
        if (checkUser) {
          res.status(404).json({
            error: {
              errorMessage: ["Your email already exited"],
            },
          });
        } else {
          let picture;
          
          if (image) {
            try {
              const uploadResponse = await cloudinary.uploader.upload(
                image[0].filepath,
                {
                  folder: "socially",
                }
              );
              picture = uploadResponse.secure_url;
            } catch (error) {
              console.error("Error uploading image:", error);

              return res.status(400).json({
                success: false,
                message: "Error uploading image",
              });
            }
          }
          const userCreate = await registerModel.create({
            userName,
            email,
            password: await bcrypt.hash(password, 10),
            image: picture || process.env.DEFAULT_PICTURE,
          });

          const token = jwt.sign(
            {
              id: userCreate._id,
              email: userCreate.email,
              userName: userCreate.userName,
              image: picture || process.env.DEFAULT_PICTURE,
              registerTime: userCreate.createdAt,
            },
            process.env.ACCESS_TOKEN_SECRET,
            {
              expiresIn: process.env.TOKEN_EXP,
            }
          );

          const options = {
            expires: new Date(
              Date.now() + process.env.COOKIE_EXP * 24 * 60 * 60 * 1000
            ),
          };
   
          res.status(201).cookie("authToken", token, options).json({
            successMessage: "Your Register Successful",
            token,
          });
        }
      } catch (error) {
        console.log("ERROR", error);
        res.status(500).json({
          error: {
            errorMessage: ["Interanl Server Error"],
          },
        });
      }
    }
  }); // end Formidable
};
