const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Define the schema for the user model
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Middleware to hash password before saving
userSchema.pre("save", async function (next) {
  // Check if the password field was modified (only hash if it's modified)
  if (this.isModified("password")) {
    try {
      const salt = await bcrypt.genSalt(10); // Generate salt with 10 rounds
      this.password = await bcrypt.hash(this.password, salt); // Hash the password
    } catch (err) {
      next(err); // Pass the error to the next middleware
    }
  }
  next(); // Proceed to the next middleware
});

// Method to compare entered password with stored password
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password); // Compare the plain password with the hashed one
};

// Export the User model
module.exports = mongoose.model("User", userSchema);
