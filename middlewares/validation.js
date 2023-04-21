const app = require("express")();

// const cloudinary = require("cloudinary").v2;
// const fileUpload = require("express-fileupload");
const {
  isNameValid,
  isAgeValid,
  isEmailValid,
  isPasswordValid,
} = require("./../utils/formValidation");
const { encryptPassword } = require("./../utils/password");

// models
const Users = require("./../models/UserMode");

// Configuration
// cloudinary.config({
//   cloud_name: process.env.COULD_NAME,
//   api_key: process.env.API_KEY,
//   api_secret: process.env.API_SECRET,
// });

// app.use(
//   fileUpload({
//     useTempFiles: true,
//     tempFileDir: "/tmp/",
//   })
// );

exports.validation = async (req, res, next) => {
  try {
    const { name, age, email, password } = req.body;
    if (!(name && age && email && password)) {
      return res.status(400).json({
        success: false,
        msg: "all fields are required",
      });
    }
    if (isNameValid(name)) {
      return res.status(400).json({
        success: false,
        msg: "Please enter valid Name",
      });
    }
    if (isAgeValid(age)) {
      return res.status(400).json({
        success: false,
        msg: "Please enter valid age",
      });
    }
    if (isEmailValid(email)) {
      return res.status(400).json({
        success: false,
        msg: "Please enter valid Email",
      });
    }
    if (isPasswordValid(password)) {
      return res.status(400).json({
        success: false,
        msg: "Please enter valid password",
      });
    }
    const findUser = await Users.findOne({ email: email.toLowerCase() });
    if (findUser) {
      return res.status(400).json({
        success: false,
        msg: "user details already exist.",
      });
    }

    // // do image upload process here
    // let result = await cloudinary.uploader.upload(
    //   req.files.image[0].tempFilePath,
    //   {
    //     folder: "authentication",
    //   }
    // );

    const userDetails = {
      name: name[0].toUpperCase() + name.slice(1).toLowerCase(),
      age,
      email,
      password: await encryptPassword(password),
      image: "none",
    };
    req.body = userDetails;
    next();
  } catch (e) {
    next(e.message);
  }
};

exports.imageValidation = async (req, res, next) => {
  try {
    // do image upload process here
    // let result = await cloudinary.uploader.upload(
    //   req.files.image[0].tempFilePath,
    //   {
    //     folder: "authentication",
    //   }
    // );

    req.body = {
      image: "none",
    };
    next();
  } catch (e) {
    next(e.message);
  }
};
