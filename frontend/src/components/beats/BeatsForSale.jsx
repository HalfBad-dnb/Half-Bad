import React, { useEffect, useState } from 'react';

const BeatsPage = () => {
  const [beats, setBeats] = useState([]);
  const [playing, setPlaying] = useState(null);

  // Sample YouTube links (replace these with actual YouTube URLs for your beats)
  const youtubeLinks = [
    "https://www.youtube.com/embed/H_SCr8iOTAo", 
    "https://www.youtube.com/embed/3JZ_D3ELwOQ",
    "https://www.youtube.com/embed/9bZkp7q19f0", 
    // Add more YouTube track URLs here
  ];

  const handlePlay = (beatId) => {
    if (playing === beatId) {
      setPlaying(null);
    } else {
      setPlaying(beatId);
    }
  };

  useEffect(() => {
    setBeats(youtubeLinks);
  }, []);

  if (!beats.length) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen text-white bg-gradient-to-r from-[#4B0000] to-[#000000]">
      <section className="py-20 px-8">
        <h1 className="text-5xl font-bold text-[#FFD700] animate-logo text-center">Beats Collection</h1>

        {/* Most Recent Release */}
        <div className="mt-12 text-center">
          <h2 className="text-4xl text-[#FFD700] mb-8">Most Recent Release</h2>
          <div className="relative bg-[#FFD700] border-4 border-[#4B0000] rounded-xl shadow-xl overflow-hidden max-w-4xl w-full mx-auto mb-12">
            <div className="relative w-full h-0" style={{ paddingTop: '56.25%' }}>
              <div className="absolute inset-0 w-full h-full flex justify-center items-center">
                <button
                  onClick={() => handlePlay(0)}
                  className="text-4xl font-semibold text-[#FFD700] bg-[#1a1a1a] px-8 py-4 rounded-xl shadow-md hover:bg-[#FFD700] hover:text-[#1a1a1a] transition-all"
                >
                  {playing === 0 ? "Stop Preview" : "Play Preview"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Top 3 Popular Beats - Larger size, displayed horizontally */}
        <div className="mt-12 text-center">
          <h2 className="text-4xl text-[#FFD700] mb-8">Top 3 Most Popular Beats</h2>
          <div className="flex justify-center gap-8">
            {beats.slice(0, 3).map((trackUrl, index) => (
              <div key={index} className="relative bg-[#FFD700] border-4 border-[#4B0000] rounded-xl shadow-xl overflow-hidden w-80 lg:w-96">
                <div className="relative w-full h-0" style={{ paddingTop: '56.25%' }}>
                  <iframe
                    className="absolute inset-0 w-full h-full transform hover:scale-105 transition-all duration-300"
                    src={trackUrl}
                    title={`YouTube player ${index}`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* All Beats - Smaller size, displayed in grid with transparent background */}
        <section className="mt-12 text-center">
          <h2 className="text-4xl text-[#FFD700] mb-8">All Beats</h2>
          <div className="bg-transparent grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-4">
            {beats.map((trackUrl, index) => (
              <div key={index} className="relative bg-[#FFD700] border-4 border-[#4B0000] rounded-xl shadow-xl overflow-hidden w-48 md:w-64">
                <div className="relative w-full h-0" style={{ paddingTop: '56.25%' }}>
                  <iframe
                    className="absolute inset-0 w-full h-full transform hover:scale-105 transition-all duration-300"
                    src={trackUrl}
                    title={`YouTube player ${index}`}
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

export default BeatsPage;
