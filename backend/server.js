// server.js (Backend example with Express)
const express = require("express");
const app = express();
const cors = require("cors");
const PORT = 8080;

let posts = []; // Store posts in memory (use a database in production)

app.use(cors());
app.use(express.json());

// Fetch posts
app.get("/api/posts", (req, res) => {
  res.json(posts);
});

// Submit a new post
app.post("/api/posts", (req, res) => {
  const { content, media, mediaType } = req.body;
  const newPost = {
    id: posts.length + 1,
    author: "Current User",
    content,
    media,
    mediaType,
    timestamp: Date.now(),
  };
  posts.push(newPost);
  res.status(201).json(newPost);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
