import React, { useEffect, useState } from "react";
import axios from "axios";
import Post from "./Post";
import PostForm from "./PostForm";

const API_URL = "http://localhost:8081/api/posts"; // Backend URL

const PostBoard = () => {
  const [posts, setPosts] = useState([]);

  // Fetch posts from backend
  useEffect(() => {
    axios
      .get(API_URL)
      .then((response) => setPosts(response.data))
      .catch((error) => console.error("Error fetching posts:", error));
  }, []);

  // Handle new post submission
  const handlePostSubmit = (newPost) => {
    // Get JWT token from localStorage (or sessionStorage)
    const token = localStorage.getItem('jwtToken'); // Replace with actual location where token is stored

    axios
      .post(API_URL, {
        author: "Current User", // You can update this with the actual logged-in user data
        content: newPost.content,
        media: newPost.media,
        mediaType: newPost.mediaType,
      }, {
        headers: {
          Authorization: `Bearer ${token}` // Add JWT token to Authorization header
        }
      })
      .then((response) => setPosts([response.data, ...posts]))
      .catch((error) => console.error("Error creating post:", error));
  };

  return (
    <div className="post-board">
      <h2>Post Feed</h2>
      <PostForm onSubmit={handlePostSubmit} />
      {posts.length > 0 ? (
        posts.map((post) => <Post key={post.id} post={post} />)
      ) : (
        <p>No posts available</p>
      )}
    </div>
  );
};

export default PostBoard;
