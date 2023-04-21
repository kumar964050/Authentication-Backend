const jwt = require("jsonwebtoken");
const routers = require("express").Router();
const Users = require("./../models/UserMode"); //models
// middlewares
const { validation } = require("./../middlewares/validation");
const { auth } = require("./../middlewares/authentication");
// validations
const { isNameValid, isAgeValid } = require("./../utils/formValidation");
const { decryptPassword } = require("./../utils/password");

const mailHelper = require("./../utils/mailHelper");

// post register
routers.route("/register").post(validation, async (req, res, next) => {
  const newUser = await Users.create(req.body);
  newUser.password = undefined;
  const url =
    req.protocol +
    "://" +
    req.hostname +
    ":" +
    process.env.PORT +
    `/users/verify/${newUser.user_id}`;
  // send verification mail to user over the mail
  //   need to send ui
  //   success register ui

  // sending ui
  res.send({
    success: true,
    msg: "Registered",
  });

  await mailHelper({
    to: newUser.email,
    subject: "verify account",
    text: `please verify your account by click this link ${url}`,
  });
});
// get verify
routers.route("/verify/:UserID").get(async (req, res, next) => {
  const { UserID } = req.params;
  const findUser = await Users.findOne({ user_id: UserID });
  if (!findUser) {
    return res.status(400).send({
      success: false,
      msg: "invalid user details",
    });
  }
  await Users.updateOne({ user_id: UserID }, { is_verified: true });

  //   need to send ui
  //   success verified ui
  res.send(` <div
      style='
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        min-height: 90vh;
        color: green;
        font-weight: 600;
      '
    >
      <p>Your Account verified successfully.</p>
    <script defer>
     
      setTimeout(() => {
        window.location.href = '/login';
      }, 3000);
    </script>
    </div>`);
  await mailHelper({
    to: findUser.email,
    subject: "account verified",
    text: `your account verified.`,
  });
});
// post login
routers.route("/login").post(async (req, res, next) => {
  const { email, password } = req.body;
  if (!(email && password)) {
    return res.status(400).send({
      success: false,
      msg: "all fields are required",
    });
  }
  const findUser = await Users.findOne({ email: email.toLowerCase() }).select(
    "+password"
  );

  if (!findUser) {
    return res.status(400).send({
      success: false,
      msg: "invalid user details",
    });
  }
  const comparedPassword = await decryptPassword(password, findUser.password);
  if (!comparedPassword) {
    return res.status(400).send({
      success: false,
      msg: "invalid Password.",
    });
  }
  const token = jwt.sign(
    { user_id: findUser.user_id },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRY,
    }
  );
  res.send({
    success: true,
    token,
  });
});
// get my profile
routers.route("/profile").get(auth, async (req, res, next) => {
  res.send(req.user);
});
// get all profiles
routers.route("/all/profiles").get(auth, async (req, res, next) => {
  const findUsers = await Users.find({ user_id: { $ne: req.user.user_id } });
  res.send(findUsers);
});
// // put update data
// routers.route("/update").put(auth, async (req, res, next) => {
//   let { name, age } = req.body;
//   name = name === undefined ? req.user.name : name;
//   age = age === undefined ? req.user.age : age;
//   if (isNameValid(name)) {
//     return res.status(400).send({
//       success: false,
//       msg: "please enter valid name",
//     });
//   }
//   if (isAgeValid(age)) {
//     return res.status(400).send({
//       success: false,
//       msg: "please enter valid age",
//     });
//   }
//   await Users.updateOne(
//     { user_id: req.user.user_id },
//     {
//       name,
//       age,
//     }
//   );
//   res.send({
//     msg: "successfully updated",
//   });
// });
// delete  delete user
routers.route("/delete").delete(auth, async (req, res, next) => {
  await Users.deleteOne({ user_id: req.user.user_id });
  res.send({
    msg: "successfully deleted",
  });
});

module.exports = routers;
