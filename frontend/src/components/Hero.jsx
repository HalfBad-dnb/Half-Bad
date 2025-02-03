import React, { useEffect, useState } from "react";

const Hero = ({ title, description, logoSrc }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setVisible(true);
    }, 500);
  }, []);

  return (
    <header className="relative flex flex-col items-center justify-center mb-0">
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      <div className="relative z-10 p-6 text-center flex flex-col items-center justify-center">
        {/* Logo with fade-in effect */}
        <div
          className={`flex justify-center mb-12 ${visible ? "opacity-100 transform scale-100" : "opacity-0 transform scale-150"} transition-all duration-1000 ease-in-out relative`}
        >
          <img
            src={logoSrc} // Dynamic logo path
            alt="Logo"
            className="h-48"
          />
        </div>

        {/* Title and Description */}
        <h1 className="text-3xl font-bold text-[#FFD700] mb-4">{title}</h1>
        <p className="text-lg text-gray-300 mt-2 max-w-lg mx-auto">{description}</p>
      </div>
    </header>
  );
};

export default Hero;
