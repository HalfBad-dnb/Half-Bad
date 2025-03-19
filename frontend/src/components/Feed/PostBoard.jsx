import React, { useEffect, useState } from "react";
import Post from "./Post";
import PostForm from "./PostForm";

const PostBoard = () => {
  const [posts, setPosts] = useState([]);

  // Simulate fetching posts from a backend
  useEffect(() => {
    const initialPosts = [
      {
        id: 1,
        author: "John Doe",
        content: "Check out this cool cat picture!",
        media: "https://via.placeholder.com/300",
        mediaType: "image",
        timestamp: Date.now(),
      },
      {
        id: 2,
        author: "Jane Smith",
        content: "Here's a cool video I found!",
        media: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        mediaType: "video",
        timestamp: Date.now(),
      },
    ];
    setPosts(initialPosts);
  }, []);

  const handlePostSubmit = (newPost) => {
    const updatedPosts = [
      {
        id: posts.length + 1,
        author: "Current User",
        content: newPost.content,
        media: newPost.media,
        mediaType: newPost.mediaType,
        timestamp: Date.now(),
      },
      ...posts,
    ];
    setPosts(updatedPosts);
  };

  return (
    <div className="post-board container mx-auto p-6 bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl shadow-lg">
      <h2 className="text-3xl text-white font-semibold mb-6">Post Feed</h2>
      <PostForm onSubmit={handlePostSubmit} />
      <div className="posts-list mt-6">
        {posts.length > 0 ? (
          posts.map((post) => <Post key={post.id} post={post} />)
        ) : (
          <p className="text-white">No posts available</p>
        )}
      </div>
    </div>
  );
};

export default PostBoard;
