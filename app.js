require("dotenv").config(); // env config
require("./config/database").connect(); // db connection

const express = require("express");
const app = express();

// user controller
const Users = require("./controllers/userController");

// regular middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

// router middleware
app.use("/users", Users);

// post listening
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running at PORT : ${PORT} `);
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("signup");
});

app.get("/", async (req, res) => {
  res.render("home");
});
