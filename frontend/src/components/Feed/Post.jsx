import React from "react";

const Post = ({ post }) => {
  const { author, content, media, mediaType, timestamp } = post;

  return (
    <div className="bg-gray-900 shadow-md rounded-lg p-4 mb-4 border border-gray-800 transition-transform transform hover:scale-105 w-full max-w-md mx-auto">
      {/* Author & Timestamp */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-yellow-400">{author}</h3>
        <span className="text-xs text-gray-500">{new Date(timestamp).toLocaleString()}</span>
      </div>

      {/* Content */}
      <p className="text-gray-300 text-xs mb-2">{content}</p>

      {/* Media Display */}
      {media && (
        <div className="overflow-hidden rounded-md">
          {mediaType === "image" ? (
            <img src={media} alt="Post Media" className="w-full h-auto max-h-40 rounded-md object-cover" />
          ) : mediaType === "video" ? (
            <iframe
              className="w-full max-h-40 rounded-md"
              height="180"
              src={media}
              title="Embedded video"
              frameBorder="0"
              allowFullScreen
            ></iframe>
          ) : mediaType === "link" ? (
            <a
              href={media}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline break-words text-xs"
            >
              {media}
            </a>
          ) : null}
        </div>
      )}

      {/* Actions */}
      <div className="mt-2 flex gap-2">
        <button className="bg-yellow-400 text-black font-medium text-xs py-1 px-2 rounded-md transition hover:bg-yellow-300">
          Like
        </button>
        <button className="bg-gray-700 text-gray-300 text-xs py-1 px-2 rounded-md transition hover:bg-gray-600">
          Comment
        </button>
      </div>
    </div>
  );
};

export default Post;
