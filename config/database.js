const mongoose = require("mongoose");

const URL = process.env.MONGO_URL;

exports.connect = () => {
  mongoose
    .connect(URL)
    .then(() => {
      console.log("DB Connected");
    })
    .catch((e) => {
      console.log("DB Error ", e.message);
    });
};
