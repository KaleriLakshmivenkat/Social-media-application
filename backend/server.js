const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

dotenv.config(); // Load environment variables
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Ensure the uploads folder exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Serve images from the 'uploads' folder
app.use("/uploads", express.static(uploadDir));

// Multer storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Save uploaded files to the 'uploads' folder
  },
  filename: (req, file, cb) => {
    // Use a unique filename to prevent name conflicts
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// File validation: only allow images
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only images are allowed."), false);
  }
};

// Set up the upload handler with the storage configuration
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Set a file size limit of 5MB
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection failed:", err));

// API Route for uploading images
app.post("/api/upload", upload.single("file"), (req, res) => {
  // Check if a file was uploaded
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  // Return the URL to the uploaded image
  const imageUrl = `/uploads/${req.file.filename}`;
  res.status(200).json({ imageUrl });
});

// Routes for authentication and posts
const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/posts");

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

// Error Handling Middleware (for multer file validation and other errors)
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Multer specific errors (e.g., file too large)
    return res.status(400).json({ error: err.message });
  }
  if (err) {
    // Other types of errors (e.g., file validation failure)
    return res.status(400).json({ error: err.message });
  }
  next();
});

// General error handling (for uncaught exceptions)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
