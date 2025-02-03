// src/components/Navbar.tsx

import React, { useState } from "react";

type User = {
  name: string;
  profilePicture: string;
};

interface NavbarProps {
  user: User | null;
  onLogin: () => void;
  onSignup: () => void;
  onLogout: () => void;
  onUpdateDetails: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
  user,
  onLogin,
  onSignup,
  onLogout,
  onUpdateDetails,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="max-w-screen-xl mx-auto flex justify-between items-center">
        {/* Logo / Title */}
        <div className="text-2xl font-semibold">
          <span>Editor</span>
        </div>

        {/* Login / Signup or User info */}
        <div className="flex items-center space-x-4">
          {!user ? (
            <>
              <button
                onClick={onLogin}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
              >
                Login
              </button>
              <button
                onClick={onSignup}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
              >
                Signup
              </button>
            </>
          ) : (
            <div className="flex items-center space-x-3">
              {/* Profile Picture and Name */}
              <div className="flex items-center space-x-2">
                <img
                  src={user.profilePicture}
                  alt="Profile"
                  className="w-10 h-10 rounded-full"
                />
                <span className="font-semibold">{user.name}</span>
              </div>

              {/* Dropdown */}
              <div className="relative">
                <button
                  onClick={toggleDropdown}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
                >
                  &#x25BC;
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-lg shadow-md">
                    <button
                      onClick={onUpdateDetails}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Update Details
                    </button>
                    <button
                      onClick={onLogout}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
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
