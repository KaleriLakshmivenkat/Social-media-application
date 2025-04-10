const express = require("express");
const router = express.Router();
const Post = require("../models/Post");

// Create Post
router.post("/", async (req, res) => {
  const newPost = new Post(req.body);
  await newPost.save();
  res.json(newPost);
});

// Get all Posts
router.get("/", async (req, res) => {
  const posts = await Post.find();
  res.json(posts);
});

// Delete Post
router.delete("/:id", async (req, res) => {
  await Post.findByIdAndDelete(req.params.id);
  res.json({ msg: "Post Deleted" });
});

module.exports = router;
