import React, { useState, useEffect } from 'react';

const MusicPage = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 500);
  }, []);

  const musicTracks = [
    { youtubeUrl: "https://www.youtube.com/watch?v=PBAedsWfoj8", cover: "https://via.placeholder.com/300x300?text=Album+Cover+1", artist: "Cookie", song: "Tomorrow (Half Bad Remix)" },
    { youtubeUrl: "https://www.youtube.com/watch?v=9RB6KBnvtP4", cover: "https://via.placeholder.com/300x300?text=Album+Cover+2", artist: "Eddie K", song: "Crazy Over You (Half Bad Remix)" },
    { youtubeUrl: "https://www.youtube.com/watch?v=UD4Yp77eYUU", cover: "https://via.placeholder.com/300x300?text=Album+Cover+3", artist: "Sel", song: "Ne vakar (Eddiek X Half Bad Remix)" },
    { youtubeUrl: "https://www.youtube.com/watch?v=wIfr14iGycU", cover: "https://via.placeholder.com/300x300?text=Album+Cover+4", artist: "Half Bad X Milda", song: "Dobilas" },
    { youtubeUrl: "https://www.youtube.com/watch?v=Dtf9o_OTHsc", cover: "https://via.placeholder.com/300x300?text=Album+Cover+5", artist: "Half Bad", song: "Lost" },
    { youtubeUrl: "https://www.youtube.com/watch?v=v2POWBmxJFI", cover: "https://via.placeholder.com/300x300?text=Album+Cover+6", artist: "Chase and Status", song: "Baddadan (Half Bad Remix)" },
    { youtubeUrl: "https://www.youtube.com/watch?v=2RxQo6tI4Z8", cover: "https://via.placeholder.com/300x300?text=Album+Cover+7", artist: "Half Bad", song: "U hear dat Bass" },
    { youtubeUrl: "https://www.youtube.com/watch?v=gQ0RKKEDmOE", cover: "https://via.placeholder.com/300x300?text=Album+Cover+8", artist: "Half Bad X TAI", song: "Dream" },
    { youtubeUrl: "https://www.youtube.com/watch?v=CnEdjCiY40g", cover: "https://via.placeholder.com/300x300?text=Album+Cover+9", artist: "Sel", song: "Neduok man jokio šanso(Half Bad Remix)" },
    { youtubeUrl: "https://www.youtube.com/watch?v=VDoNcihbhNI", cover: "https://via.placeholder.com/300x300?text=Album+Cover+10", artist: "Half Bad ", song: "Rude Boy (run dat again)" },
    { youtubeUrl: "https://www.youtube.com/watch?v=GV4JY9HsDnU", cover: "https://via.placeholder.com/300x300?text=Album+Cover+11", artist: "Half Bad , Eddiek", song: "This is my jungle" },
    { youtubeUrl: "https://www.youtube.com/watch?v=7jvW_7FerJQ", cover: "https://via.placeholder.com/300x300?text=Album+Cover+12", artist: "La roux ,Half Bad", song: "Going for de kill" },
    { youtubeUrl: "https://www.youtube.com/watch?v=bYiywfyvr1k", cover: "https://via.placeholder.com/300x300?text=Album+Cover+13", artist: "Lilas", song: "Pakelk rageli (Half Bad remix)" },
    { youtubeUrl: "https://www.youtube.com/watch?v=pqWZkM4L2x0", cover: "https://via.placeholder.com/300x300?text=Album+Cover+14", artist: "Half Bad", song: "Mad" },
    { youtubeUrl: "https://www.youtube.com/watch?v=xOOEtdSGMC8", cover: "https://via.placeholder.com/300x300?text=Album+Cover+15", artist: "Half Bad", song: "Merry" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#4B0000] to-[#000000] text-white">
      {/* Hero Section */}
      <section className="relative text-center py-20 px-8 z-30">
        <div className="absolute inset-0 bg-gradient-to-b from-[#4B0000] via-black to-[#4B0000] opacity-50"></div>
        <div className="relative z-10 max-w-7xl mx-auto">
          <h1 className={`text-5xl font-bold text-[#FFD700] mb-6 animate-pulse transition-all duration-1000 ease-in-out ${visible ? 'opacity-100 transform scale-100 blur-0' : 'opacity-0 transform scale-150 blur-sm'}`}>
            Music Collection
          </h1>
        </div>
      </section>

      {/* Music Tracks Section */}
      <section className="relative py-20 px-8 z-30">
        <div className="absolute inset-0 bg-gradient-to-b from-[#4B0000] via-black to-[#4B0000] opacity-50"></div>
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {musicTracks.map((track, index) => (
              <div key={index} className="bg-black bg-opacity-80 backdrop-blur-md p-12 rounded-2xl shadow-2xl border-2 border-[#FFD700]/20 hover:border-[#FFD700]/40 transition-all duration-500 transform hover:scale-105">
                <div className="space-y-6">
                  {/* YouTube Embed */}
                  {track.youtubeUrl && (
                    <div className="relative rounded-lg overflow-hidden shadow-xl ring-4 ring-[#FFD700]/20">
                      <iframe className="w-full h-52" src={`https://www.youtube.com/embed/${track.youtubeUrl.split('v=')[1]}`} title={track.artist} allowFullScreen></iframe>
                    </div>
                  )}
                  
                  {/* Artist Name */}
                  <h2 className="text-2xl font-bold text-[#FFD700]">{track.artist}</h2>
                  
                  {/* Song Name */}
                  <h3 className="text-lg text-gray-300">{track.song || "Unknown Song"}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default MusicPage;
