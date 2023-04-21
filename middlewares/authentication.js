const jwt = require("jsonwebtoken");
const Users = require("./../models/UserMode");

exports.auth = async (req, res, next) => {
  try {
    let token = undefined;
    if (req.headers["authorization"]) {
      token = req.headers["authorization"].split(" ")[1];
    }
    if (!token) {
      return res.status(400).send({
        success: false,
        msg: "please provide token",
      });
    }
    jwt.verify(token, process.env.JWT_SECRET, async (err, payload) => {
      if (err) {
        return res.status(400).send({
          success: false,
          msg: "jwt expired",
        });
      }
      const findUser = await Users.findOne({ user_id: payload.user_id });
      if (!findUser) {
        return res.status(400).send({
          success: false,
          msg: "access denied",
        });
      }
      req.user = findUser;
      next();
    });
  } catch (error) {
    next(error.message);
  }
};
