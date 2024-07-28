const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors({ origin: "https://bakestring.tech", credentials: true }));

const uri =
  "mongodb+srv://ayushsuperstar48:ayush16@bake-string.meeaaiw.mongodb.net/?retryWrites=true&w=majority&appName=bake-string";
const client = new MongoClient(uri);

let db;
let collection;

async function main() {
  await client.connect();
  db = client.db("bake-string-DB");
  collection = db.collection("userLists");
  console.log("connected to bake-string-DB");
}

main().catch(console.error);

// Get all todo lists
app.get("/todos", async (req, res) => {
  try {
    const todos = await collection.find({}).toArray();
    res.status(200).json(todos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new todo list
app.post("/todos", async (req, res) => {
  try {
    const todo = req.body;
    await collection.insertOne(todo);
    res.status(201).json(todo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a todo list by id
app.delete("/todos/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await collection.deleteOne({ _id: new ObjectId(id) });
    res.status(200).json({ message: "Todo deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on http://0.0.0.0:${port}`);
});
