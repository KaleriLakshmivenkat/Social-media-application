import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Home.css";

function Home() {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [editingPostId, setEditingPostId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [editImage, setEditImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // To manage loading state

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setIsLoading(true); // Show loading indicator
    try {
      const res = await axios.get("http://localhost:5000/api/posts");
      setPosts(res.data);
    } catch (err) {
      console.error("Fetch error:", err.message);
    } finally {
      setIsLoading(false); // Hide loading indicator
    }
  };

  const createPost = async () => {
    if (!content.trim()) return;

    const formData = new FormData();
    formData.append("userId", "123"); // Replace with actual userId if applicable
    formData.append("content", content);
    if (image) formData.append("image", image);

    // Log the form data to check if everything is correct
    console.log("Form Data:", formData);
    
    try {
      const response = await axios.post("http://localhost:5000/api/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Post created:", response.data);  // Log the server response

      setContent("");
      setImage(null);
      fetchPosts();
    } catch (err) {
      console.error("Create error:", err.message);
      // Log the detailed error message to understand more
      console.error("Error details:", err.response ? err.response.data : err);
    }
  };

  const deletePost = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/posts/${id}`);
      fetchPosts();
    } catch (err) {
      console.error("Delete error:", err.message);
    }
  };

  const startEditing = (post) => {
    setEditingPostId(post._id);
    setEditContent(post.content);
    setEditImage(null);
  };

  const cancelEdit = () => {
    setEditingPostId(null);
    setEditContent("");
    setEditImage(null);
  };

  const updatePost = async () => {
    if (!editContent.trim()) return;

    const formData = new FormData();
    formData.append("content", editContent);
    if (editImage) formData.append("image", editImage);

    try {
      await axios.put(`http://localhost:5000/api/posts/${editingPostId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      cancelEdit();
      fetchPosts();
    } catch (err) {
      console.error("Update error:", err.message);
    }
  };

  return (
    <div className="home-container">
      <h2>Create a Post</h2>
      <div className="input-post">
        <input
          type="text"
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <input type="file" onChange={(e) => setImage(e.target.files[0])} />
        <button onClick={createPost}>Post</button>
      </div>

      <div>
        <h3>All Posts</h3>
        {isLoading ? (
          <p>Loading posts...</p>
        ) : posts.length === 0 ? (
          <p className="no-posts">No posts to display</p>
        ) : (
          posts.map((p) => (
            <div className="post" key={p._id}>
              {editingPostId === p._id ? (
                <div className="edit-area" style={{ width: "100%" }}>
                  <input
                    type="text"
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    style={{ width: "100%", padding: "8px", marginBottom: "8px" }}
                  />
                  <input type="file" onChange={(e) => setEditImage(e.target.files[0])} />
                  <div className="edit-buttons" style={{ display: "flex", gap: "10px" }}>
                    <button style={{ backgroundColor: "green" }} onClick={updatePost}>
                      Save
                    </button>
                    <button onClick={cancelEdit}>Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <p>{p.content}</p>
                  {p.image && (
                    <img
                      src={`http://localhost:5000${p.image}`}
                      alt="Post"
                      style={{ maxWidth: "100%", height: "auto", marginBottom: "10px" }}
                    />
                  )}
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button
                      style={{ backgroundColor: "#ffc107", color: "black" }}
                      onClick={() => startEditing(p)}
                    >
                      Edit
                    </button>
                    <button onClick={() => deletePost(p._id)}>Delete</button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Home;
