const mongoose = require("mongoose");
const { v4: uuidV4 } = require("uuid");

const userSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
      default: () => uuidV4(),
    },
    name: {
      type: String,
      required: true,
      default: "User",
    },
    age: {
      type: Number,
      required: true,
      default: 18,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    is_verified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Users", userSchema);

// some point need to change method to OTP base forgot password
