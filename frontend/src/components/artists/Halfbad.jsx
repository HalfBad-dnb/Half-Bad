import React, { useState } from "react";

const Halfbad = () => {
  const [recentRelease] = useState({
    videoUrl: "https://www.youtube.com/embed/H_SCr8iOTAo?enablejsapi=1",
  });

  const popularTracks = [
    {
      videoUrl: "https://www.youtube.com/embed/3JZ_D3ELwOQ?enablejsapi=1",
    },
    {
      videoUrl: "https://www.youtube.com/embed/9bZkp7q19f0?enablejsapi=1",
    },
    {
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ?enablejsapi=1",
    },
  ];

  const allTracks = [
    {
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ?enablejsapi=1",
    },
    {
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ?enablejsapi=1",
    },
    {
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ?enablejsapi=1",
    },
    {
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ?enablejsapi=1",
    },
    {
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ?enablejsapi=1",
    },
    {
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ?enablejsapi=1",
    },

    {
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ?enablejsapi=1",
    },
    {
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ?enablejsapi=1",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#4B0000] to-[#000000] text-white">
      {/* Main content for Half Bad's page */}
      <section className="py-20 px-8">
        <h1 className="text-5xl font-bold text-[#FFD700] animate-logo text-center">Half Bad</h1>

        {/* Recent Release */}
        <div className="mt-12 text-center">
          <h2 className="text-4xl text-[#FFD700] mb-8">Most Recent Release</h2>
          <div className="relative bg-[#FFD700] border-4 border-[#4B0000] rounded-xl shadow-xl overflow-hidden max-w-4xl w-full mx-auto mb-12">
            <div className="relative w-full h-0" style={{ paddingTop: '56.25%' }}>
              <iframe
                className="absolute inset-0 w-full h-full transform hover:scale-105 transition-all duration-300"
                width="100%"
                height="100%"
                src={recentRelease.videoUrl}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>

        {/* Popular Tracks - Large size, displayed horizontally */}
        <div className="mt-12 text-center">
          <h2 className="text-4xl text-[#FFD700] mb-8">Top 3 Most Popular Tracks</h2>
          <div className="flex justify-center gap-8">
            {popularTracks.map((track, index) => (
              <div key={index} className="relative bg-[#FFD700] border-4 border-[#4B0000] rounded-xl shadow-xl overflow-hidden w-80 lg:w-96">
                <div className="relative w-full h-0" style={{ paddingTop: '56.25%' }}>
                  <iframe
                    className="absolute inset-0 w-full h-full transform hover:scale-105 transition-all duration-300"
                    width="100%"
                    height="100%"
                    src={track.videoUrl}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* All Left Tracks - Title and Smaller size, displayed in grid with transparent background */}
        <section className="mt-12 text-center">
          <h2 className="text-4xl text-[#FFD700] mb-8">All Tracks</h2>
          <div className="bg-transparent grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-4">
            {allTracks.map((track, index) => (
              <div key={index} className="relative bg-[#FFD700] border-4 border-[#4B0000] rounded-xl shadow-xl overflow-hidden w-48 md:w-64">
                <div className="relative w-full h-0" style={{ paddingTop: '56.25%' }}>
                  <iframe
                    className="absolute inset-0 w-full h-full transform hover:scale-105 transition-all duration-300"
                    width="100%"
                    height="100%"
                    src={track.videoUrl}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            ))}
          </div>
        </section>
      </section>
    </div>
  );
};

export default Halfbad;
