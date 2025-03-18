import React from 'react';

const EddiekPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-[#4B0000] to-[#000000] text-white">
      {/* Main content for Eddiek's page */}
      <section className="py-20 px-8">
        <h1 className="text-5xl font-bold text-[#FFD700] animate-logo text-center">Eddiek Music Collection</h1>

        {/* Music Video Sections with Fancy Styled Player */}
        <div className="mt-12 space-y-16 flex flex-col items-center">
          {/* Fancy Player for First Track */}
          <div className="relative bg-[#1a1a1a] rounded-xl shadow-xl overflow-hidden max-w-4xl w-full">
            {/* Fancy Video Player with Custom Styles */}
            <div className="relative w-full h-0" style={{ paddingTop: '56.25%' }}>
              <iframe
                className="absolute inset-0 w-full h-full transform hover:scale-105 transition-all duration-300"
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/H_SCr8iOTAo?enablejsapi=1"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            {/* Track Info Overlay */}
            <div className="absolute bottom-0 left-0 p-4 bg-[#00000090] w-full text-center">
              <h2 className="text-3xl font-semibold text-[#FFD700]">EddieK</h2>
              <p className="text-xl text-[#FFD700]">Burnin'</p>
            </div>
          </div>

          {/* Fancy Player for Second Track */}
          <div className="relative bg-[#1a1a1a] rounded-xl shadow-xl overflow-hidden max-w-4xl w-full">
            <div className="relative w-full h-0" style={{ paddingTop: '56.25%' }}>
              <iframe
                className="absolute inset-0 w-full h-full transform hover:scale-105 transition-all duration-300"
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/3JZ_D3ELwOQ?enablejsapi=1"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            {/* Track Info Overlay */}
            <div className="absolute bottom-0 left-0 p-4 bg-[#00000090] w-full text-center">
              <h2 className="text-3xl font-semibold text-[#FFD700]">Artist Name</h2>
              <p className="text-xl text-[#FFD700]">Track: Another Great Song</p>
            </div>
          </div>

          {/* Fancy Player for Third Track */}
          <div className="relative bg-[#1a1a1a] rounded-xl shadow-xl overflow-hidden max-w-4xl w-full">
            <div className="relative w-full h-0" style={{ paddingTop: '56.25%' }}>
              <iframe
                className="absolute inset-0 w-full h-full transform hover:scale-105 transition-all duration-300"
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/9bZkp7q19f0?enablejsapi=1"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            {/* Track Info Overlay */}
            <div className="absolute bottom-0 left-0 p-4 bg-[#00000090] w-full text-center">
              <h2 className="text-3xl font-semibold text-[#FFD700]">Artist Name</h2>
              <p className="text-xl text-[#FFD700]">Track: Song Title 3</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EddiekPage;
