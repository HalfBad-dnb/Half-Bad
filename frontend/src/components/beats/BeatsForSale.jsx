import React, { useEffect, useState } from 'react';

const BeatsPage = () => {
  const [beats, setBeats] = useState([]);
  const [playing, setPlaying] = useState(null);

  // Sample SoundCloud links (replace these with actual track URLs from SoundCloud)
  const soundCloudLinks = [
    "https://soundcloud.com/halfbadx76/vintage-culture-this-feeling-half-bad-remix", 
    "https://soundcloud.com/halfbadx76/sel-x-half-bad-neduok-man-jokio-sanso-drum-n-bass-remix",
    // Add more SoundCloud track URLs here
  ];

  const handlePlay = (beatId, trackUrl) => {
    if (playing === beatId) {
      setPlaying(null);
    } else {
      setPlaying(beatId);
    }
  };

  useEffect(() => {
    setBeats(soundCloudLinks);
  }, []);

  if (!beats.length) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen text-white"> {/* Removed background class */}
      <section className="py-20 px-8">
        <h1 className="text-5xl font-bold text-[#FFD700] animate-logo text-center">Beats Collection</h1>

        {/* Beats List Section */}
        <div className="mt-12 space-y-16 flex flex-col items-center">
          {beats.map((trackUrl, index) => (
            <div key={index} className="relative bg-[#1a1a1a] rounded-xl shadow-xl overflow-hidden max-w-4xl w-full transform transition-all duration-500 hover:scale-105">
              {/* Audio Player for Beat */}
              <div className="relative w-full h-0" style={{ paddingTop: '56.25%' }}>
                <div className="absolute inset-0 w-full h-full flex justify-center items-center">
                  <button
                    onClick={() => handlePlay(index, trackUrl)}
                    className="text-4xl font-semibold text-[#FFD700] bg-[#1a1a1a] px-8 py-4 rounded-xl shadow-md hover:bg-[#FFD700] hover:text-[#1a1a1a] transition-all"
                  >
                    {playing === index ? "Stop Preview" : "Play Preview"}
                  </button>
                </div>
              </div>
              {/* Track Info Overlay */}
              <div className="absolute bottom-0 left-0 p-4 bg-[#00000090] w-full text-center rounded-b-xl">
                <h2 className="text-3xl font-semibold text-[#FFD700]">Track {index + 1}</h2>
                <p className="text-xl text-[#FFD700]">$10</p> {/* You can replace this with dynamic prices */}
              </div>

              {/* SoundCloud Embed Player */}
              {playing === index && (
                <div className="absolute inset-0 w-full h-full flex justify-center items-center">
                  <iframe 
                    width="100%" 
                    height="166" 
                    scrolling="no" 
                    frameBorder="no" 
                    src={`https://w.soundcloud.com/player/?url=${trackUrl}&auto_play=true&show_artwork=false`}
                    title={`soundcloud-player-${index}`}
                    className="rounded-xl shadow-lg"
                  ></iframe>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default BeatsPage;
