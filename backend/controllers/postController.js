const Post = require("../models/Post");

exports.createPost = async (req, res) => {
  const post = new Post({ content: req.body.content, userId: req.user.id });
  await post.save();
  res.json(post);
};

exports.getPosts = async (req, res) => {
  const posts = await Post.find().populate("userId", "username");
  res.json(posts);
};
