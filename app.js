const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const path = require("path");
const cors = require("cors");
const https = require("https");
const fs = require("fs");

const app = express();
const port = 443; // Change port to 443 for HTTPS

const options = {
  key: fs.readFileSync(
    "/etc/letsencrypt/live/bakestring.centralindia.cloudapp.azure.com/privkey.pem"
  ),
  cert: fs.readFileSync(
    "/etc/letsencrypt/live/bakestring.centralindia.cloudapp.azure.com/fullchain.pem"
  ),
};

app.use(express.json());
app.use(
  cors({
    origin: ["https://bake-string.azurewebsites.net", "http://localhost:3000"],
  })
);

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

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

// Get all todo lists
app.get("/", async (req, res) => {
  try {
    const todos = await collection.find({}).toArray();
    res.status(200).json(todos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new todo list
app.post("/", async (req, res) => {
  try {
    const todo = req.body;
    await collection.insertOne(todo);
    res.status(201).json(todo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a todo list by id
app.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await collection.deleteOne({ _id: new ObjectId(id) });
    res.status(200).json({ message: "Todo deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start HTTPS server
https.createServer(options, app).listen(port, "0.0.0.0", () => {
  console.log(`Server running on https://0.0.0.0:${port}`);
});
