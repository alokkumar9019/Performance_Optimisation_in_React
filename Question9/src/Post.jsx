import React, { useMemo } from 'react';

function Post({ post, toggle }) {
  const bgColor = useMemo(() => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
  }, []);

  console.log("Rendered Post ID:", post.id);

  return (
    <div style={{ backgroundColor: bgColor, margin: "10px", padding: "10px", borderRadius: "8px" }}>
      <h3>ID: {post.id}</h3>
      <h4>Title: {post.title}</h4>
      <p>Body: {post.body}</p>
      <p>Status: {post.verifyPost ? "✅ Verified" : "❌ Not Verified"}</p>
      <button onClick={() => toggle(post.id)}>
        {post.verifyPost ? "Unverify" : "Verify"}
      </button>
    </div>
  );
}

export default React.memo(Post);
