const router = require("express").Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Import the User model

// Register route
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json("User already exists");
    }

    // Create new user
    const newUser = new User({ username, email, password });
    await newUser.save();

    res.status(200).json("User registered");
  } catch (error) {
    res.status(500).json("Server error");
  }
});

// Login route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json("Invalid credentials");
    }

    // Compare password with stored hash
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json("Invalid credentials");
    }

    // Generate JWT token
    const token = jwt.sign({ email: user.email }, "secretKey", { expiresIn: "1h" });
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json("Server error");
  }
});

module.exports = router;
