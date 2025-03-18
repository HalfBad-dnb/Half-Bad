import React from "react";
import { NavLink } from "react-router-dom";


const ArtistMenu = () => {
  return (
    <nav className="bg-gray-800 p-4 rounded-lg shadow-md text-white text-center">
      <h2 className="text-2xl font-bold mb-3">Artists</h2>
      <ul className="flex justify-center gap-6">
        <li>
          <NavLink 
            to="/halfbad" 
            className={({ isActive }) => 
              isActive ? "text-yellow-400 font-semibold" : "hover:text-gray-400 transition"
            }
          >
            Half Bad
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/eddiek" 
            className={({ isActive }) => 
              isActive ? "text-yellow-400 font-semibold" : "hover:text-gray-400 transition"
            }
          >
            Eddie K
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/music" 
            className={({ isActive }) => 
              isActive ? "text-yellow-400 font-semibold" : "hover:text-gray-400 transition"
            }
          >
            Music Collection
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default ArtistMenu;
