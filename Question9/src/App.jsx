import React, { useState, useEffect, useCallback } from "react";
import Post from "./Post";

function App() {
  const [timer, setTimer] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [posts, setPosts] = useState([]);

  // Timer setup
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Add post handler with useCallback
  const addPost = useCallback(() => {
    if (!title.trim() || !body.trim()) {
      alert("Please enter both title and body!");
      return;
    }
    const newPost = {
      id: Date.now(),
      title,
      body,
      verifyPost: false
    };
    setPosts(prev => [...prev, newPost]);
    setTitle("");
    setBody("");
  }, [title, body]);

  // Toggle verifyPost handler with useCallback
  const toggleVerify = useCallback((id) => {
    setPosts(prev =>
      prev.map(post =>
        post.id === id ? { ...post, verifyPost: !post.verifyPost } : post
      )
    );
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Timer: {timer}s</h1>

      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ margin: "5px", padding: "5px" }}
      /><br />

      <input
        type="text"
        placeholder="Body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        style={{ margin: "5px", padding: "5px" }}
      /><br />

      <button onClick={addPost}>Add Post</button>

      <hr />

      {posts.map(post => (
        <Post
          key={post.id}
          post={post}
          toggle={toggleVerify}
        />
      ))}
    </div>
  );
}

export default App;
