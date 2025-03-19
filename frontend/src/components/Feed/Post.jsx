// Post.jsx
import React from "react";

const Post = ({ post }) => {
  return (
    <div className="post">
      <div className="post-header">
        <h3>{post.author}</h3>
        <p>{new Date(post.timestamp).toLocaleString()}</p>
      </div>
      <div className="post-content">
        <p>{post.content}</p>
        {post.mediaType === "image" && (
          <img src={post.media} alt="Post media" className="post-media" />
        )}
        {post.mediaType === "video" && (
          <iframe
            src={post.media}
            title="Video Post"
            className="post-media"
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen
          ></iframe>
        )}
        {post.mediaType === "link" && (
          <a href={post.media} target="_blank" rel="noopener noreferrer">
            {post.media}
          </a>
        )}
      </div>
      <div className="post-actions">
        <button>Like</button>
        <button>Comment</button>
      </div>
    </div>
  );
};

export default Post;
