const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./Schemas/user");
const Todo = require("./Schemas/todo");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors({ origin: "https://bakestring.tech" }));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

const mongodburi = process.env.MONGODB_URI;

async function main() {
  await mongoose.connect(mongodburi);
  console.log("connected to mongodb");
}

main().catch(console.error);

app.get("/", (req, res) => {
  res.status(200);
});

app.post("/users", async (req, res) => {
  try {
    const { username } = req.body;
    const data = await User.findOne({ username: username });
    res.status(200).json({ exists: !!data });
  } catch (err) {
    res.status(500).json({ error: "An error occured" });
  }
});

app.post("/email", async (req, res) => {
  try {
    const result = await User.findOne({ email: req.body.email });
    res.status(200).json({ exists: !!result });
  } catch (err) {
    res.status(500).json({ message: "An error occured" });
  }
});

app.post("/saveUser", async (req, res) => {
  try {
    const userData = req.body;
    const result = await User.findOne({
      username: userData.username,
      email: userData.email,
    });
    if (!result) {
      let newUser = new User(userData);
      const data = await newUser.save();
      res.status(200).json({
        userId: data._id,
        message: "Account created successfully",
      });
    } else {
      res.status(409).json({ message: "User already exists" });
    }
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/todos", async (req, res) => {
  try {
    let cardData = await Todo.find({ userId: req.body.userId });
    res.status(200).json(cardData);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/userlogin", async (req, res) => {
  try {
    let { username, password } = req.body;
    const checkuser = await User.findOne({ username: username });

    if (!checkuser) {
      return res.status(400).json({ message: "User does not exist" });
    }

    const isPasswordValid = checkuser.password === password;

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    res.status(200).json({
      userId: checkuser._id,
      message: "Username and password matched",
    });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/addTodo", async (req, res) => {
  try {
    let newTodo = new Todo(req.body);
    const result = await newTodo.save();
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: "An error occured while adding todo!!!" });
  }
});

app.post("/deleteTodo", async (req, res) => {
  try {
    const deletedData = await Todo.deleteOne({ _id: req.body._id });
    res.status(200).json({ _id: req.body._id });
  } catch (err) {
    res
      .status(500)
      .json({ message: "An error occured while deleting todo!!!" });
  }
});
