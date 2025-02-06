import React, { useState } from 'react';

interface User {
  username: string;
  email: string;
  createdAt: string;
  profilePicture: string | null; // Allow null for deleted photo
}

const UserProfile: React.FC = () => {
  const dummy:User  = {
    username: 'john_doe',
    email: 'john.doe@example.com',
    createdAt: 'January 1, 2023',
    profilePicture: 'https://via.placeholder.com/150', // Replace with a valid image URL
  };

  const [username, setUsername] = useState<string>(dummy.username);
  const [profilePicture, setProfilePicture] = useState<string | null>(dummy.profilePicture);

  const handleDeletePhoto = () => {
    setProfilePicture(null);
    // Add API call to delete the photo on the server
    console.log('Photo deleted');
  };

  const handleUpdateProfilePicture = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result as string);
        // Add API call to update the profile picture on the server
        console.log('Profile picture updated');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChangeUsername = () => {
    const newUsername = prompt('Enter new username:', username);
    if (newUsername) {
      setUsername(newUsername);
      // Add API call to update the username on the server
      console.log('Username updated to:', newUsername);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-md mx-auto p-6 border rounded-lg shadow-lg bg-white">
        <div className="flex flex-col items-center space-y-6"> {/* Increased space-y for more gap */}
          {/* Profile Picture Section */}
          {profilePicture ? (
            <img
              src={profilePicture}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
              No Photo
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col space-y-4 w-full"> {/* Increased space-y for more gap */}
            <input
              type="file"
              accept="image/*"
              onChange={handleUpdateProfilePicture}
              className="hidden"
              id="profilePictureInput"
            />
            <label
              htmlFor="profilePictureInput"
              className="w-full px-4 py-2 bg-blue-500 text-white text-center rounded-lg cursor-pointer hover:bg-blue-600"
            >
              Update Profile Picture
            </label>
            <button
              onClick={handleDeletePhoto}
              className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Delete Photo
            </button>
          </div>
        </div>

        {/* User Details Section */}
        <div className="mt-6 text-center">
          <h2
            onClick={handleChangeUsername}
            className="text-2xl font-bold cursor-pointer hover:text-blue-600"
          >
            {username} (Click to change)
          </h2>
          <p className="text-gray-600">{dummy .email}</p>
          <p className="text-sm text-gray-400">Joined: {dummy .createdAt}</p>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;