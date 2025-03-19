import React, { useState } from "react";

const PostForm = ({ onSubmit }) => {
  const [content, setContent] = useState("");
  const [media, setMedia] = useState("");
  const [mediaType, setMediaType] = useState("none"); // none, image, video, link

  const handleSubmit = (e) => {
    e.preventDefault();

    if (content.trim() === "") return;

    onSubmit({ content, media, mediaType });

    setContent("");
    setMedia("");
    setMediaType("none");
  };

  const handleMediaChange = (e) => {
    const value = e.target.value;
    setMedia(value);
    if (value.startsWith("http")) {
      if (value.includes("youtube.com") || value.includes("vimeo.com")) {
        setMediaType("video");
      } else if (value.match(/\.(jpeg|jpg|gif|png)$/)) {
        setMediaType("image");
      } else {
        setMediaType("link");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl shadow-lg max-w-lg mx-auto">
      <textarea
        placeholder="Write your post here..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={4}
        className="w-full p-4 bg-gray-700 text-white rounded-lg border-2 border-gray-600 focus:outline-none focus:border-yellow-400 transition"
      />
      <input
        type="text"
        placeholder="Enter a link, image URL or video URL"
        value={media}
        onChange={handleMediaChange}
        className="w-full p-4 bg-gray-700 text-white rounded-lg border-2 border-gray-600 focus:outline-none focus:border-yellow-400 transition"
      />
      <button
        type="submit"
        className="w-full py-3 bg-yellow-400 text-gray-900 font-semibold rounded-lg shadow-md hover:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50 transition"
      >
        Post
      </button>
    </form>
  );
};

export default PostForm;
