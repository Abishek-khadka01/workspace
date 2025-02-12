import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useAuthStore from "../functions/zustand";


type User = {
  isLogin: boolean;
  name: string;
  profilePicture: string;
};

type Userdetails = User | null;

const Navbar: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState<Userdetails>(null);
  
  useEffect(() => {
    const { username, url, isLogin } = useAuthStore.getState();
    console.log(useAuthStore.getState().getDatas())
    console.log(username, url, isLogin)
    setUser({
      isLogin: isLogin,
      name: username,
      profilePicture: url,
    });
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  function onUpdateDetails() {
    console.log("Update details");
  }

  async function onLogout() {
    alert("Logout")
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const dropdown = document.getElementById('user-dropdown');
      const toggleButton = document.getElementById('dropdown-toggle');
      
      if (
        dropdown &&
        !dropdown.contains(event.target as Node) &&
        !toggleButton?.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="bg-gray-800 text-white p-4 relative z-10">
      <div className="max-w-screen-xl mx-auto flex justify-between items-center">
        {/* Logo / Title */}
        <div className="text-2xl font-semibold">
          <Link to="/">Editor</Link>
        </div>

        {/* Login / Signup or User info */}
        <div className="flex items-center space-x-4">
          {!user?.isLogin ? (
            <>
              <Link
                to="/login"
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors duration-200"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors duration-200"
              >
                Signup
              </Link>
            </>
          ) : (
            <div className="flex items-center space-x-3">
              {/* Profile Picture and Name */}
              <div className="flex items-center space-x-2">
                <img
                  src={`${user.profilePicture || null}`}
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover border-2 border-gray-600"
                />
                <span className="font-semibold">{user.name}</span>
              </div>

              {/* Dropdown */}
              <div className="relative">
                <button
                  id="dropdown-toggle"
                  onClick={toggleDropdown}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                >
                  <svg 
                    className={`w-5 h-5 transition-transform duration-200 ${isDropdownOpen ? 'transform rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M19 9l-7 7-7-7" 
                    />
                  </svg>
                </button>
                {isDropdownOpen && (
                  <div
                    id="user-dropdown"
                    className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 z-50"
                  >
                    <button
                      onClick={onUpdateDetails}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                    >
                      Update Details
                    </button>
                    <button
                      onClick={onLogout}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;