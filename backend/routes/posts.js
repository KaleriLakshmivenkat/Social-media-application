const express = require("express");
const router = express.Router();
const multer = require("multer");
const Post = require("../models/Post");
const path = require("path");

// Multer storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");  // Store uploaded files in 'uploads' directory
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;  // Use a unique name for the file
    cb(null, uniqueName);
  },
});

const upload = multer({ storage: storage });

// Get all posts
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).json({ message: "Failed to fetch posts", error: err.message });
  }
});

// Create a post with optional image
router.post("/", upload.single("image"), async (req, res) => {
  try {
    // Log incoming data for debugging
    console.log("Request Body:", req.body);
    console.log("Uploaded File:", req.file);

    // Check if the file is uploaded
    if (!req.file) {
      console.error("No image file uploaded");
      return res.status(400).json({ message: "No image file uploaded" });
    }

    const { userId, content } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;  // Set image URL if file is uploaded

    // Create a new post document
    const newPost = new Post({ userId, content, image });
    const savedPost = await newPost.save();

    console.log("Post created successfully:", savedPost);  // Log the saved post

    res.status(201).json(savedPost);
  } catch (err) {
    console.error("Error creating post:", err);
    res.status(500).json({ message: "Failed to create post", error: err.message });
  }
});

// Update a post (text and image)
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { content } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : undefined;  // Update image if provided

    // Prepare the update object
    const updateFields = { content };
    if (image) updateFields.image = image;  // Include image only if provided

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json(updatedPost);
  } catch (err) {
    console.error("Error updating post:", err);
    res.status(500).json({ message: "Failed to update post", error: err.message });
  }
});

// Delete a post
router.delete("/:id", async (req, res) => {
  try {
    const deletedPost = await Post.findByIdAndDelete(req.params.id);

    if (!deletedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error("Error deleting post:", err);
    res.status(500).json({ message: "Failed to delete post", error: err.message });
  }
});

module.exports = router;
