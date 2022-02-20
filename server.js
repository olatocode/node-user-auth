const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");
const User = require("./model/user");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json()); // express middleware

// jwt key verification
const JWT_SECRET =
  "32kdkdnffvnxgdh#@$%^&*((&((*snjd654f5hSzjZj5ta6tje6zf6tjt5z56r6g;";

// mongoose connection
mongoose.connect("mongodb://127.0.0.1:27017/login-app-db", {
  //useUrlParser: true,
  useUnifiedTopology: true,
  //createIndexes: true,
});

// html page
app.use("/", express.static(path.join(__dirname, "static")));

app.post("/api/change-password", async (req, res) => {
  const { token, newpassword: plainTextPassword } = req.body;
  if (plainTextPassword.length < 5) {
    return res.json({
      status: "error",
      error: "Password is too short, it must be 6 characters or more ",
    });
  }

  if (!plainTextPassword || typeof plainTextPassword !== "string") {
    return res.json({ status: "error", error: "Invalid password" });
  }
  try {
    const user = jwt.verify(token, JWT_SECRET);
    const _id = user.id;
    const password = await bcrypt.hash(plainTextPassword, 10);
    await User.updateOne(
      { _id },
      {
        $set: { password },
      }
    );
    res.json({ status: "ok" });
  } catch (error) {
    res.json({ status: "error", error: ";))" });
  }
});

// base url for login
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username }).lean();

  if (!user) {
    return res.json({ status: "error", error: "invalid username/password" });
  }

  if (await bcrypt.compare(password, user.password)) {
    const token = jwt.sign(
      { id: user._id, username: user.username },
      JWT_SECRET
    );

    return res.json({ status: "ok", data: token });
  }

  res.json({ status: "error", error: "invalid username/password" });
});

// base url for registration
app.post("/api/register", async (req, res) => {
  const { username, password: plainTextPassword } = req.body;

  if (!username || typeof username !== "string") {
    return res.json({ status: "error", error: "Invalid username" });
  }

  if (plainTextPassword.length < 5) {
    return res.json({
      status: "error",
      error: "Password is too short, it must be 6 characters or more ",
    });
  }

  if (!plainTextPassword || typeof plainTextPassword !== "string") {
    return res.json({ status: "error", error: "Invalid password" });
  }
  const password = await bcrypt.hash(plainTextPassword, 10);

  try {
    const response = User.create({
      username,
      password,
    });
    console.log("user created successfully", response);
  } catch (error) {
    console.log(error);
    if (error.code === 11000) {
      res.json({ status: "error", error: "Username already in use" });
    }
    throw error;
  }
  res.json({ status: "ok" });
});

// server connection
app.listen(2022, () => {
  console.log("server up at 2022");
});
