const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    image: {
      type: String,  // Optional image field
    },
  },
  {
    timestamps: true,  // This will automatically create createdAt and updatedAt fields
  }
);

module.exports = mongoose.model("Post", PostSchema);
