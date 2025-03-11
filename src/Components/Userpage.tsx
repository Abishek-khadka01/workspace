import React, { useState, useEffect } from 'react';
import { FindUser, UpdateProfile } from '../Api/apicall';
import useAuthStore from '../functions/zustand';
interface User {
  username: string;
  email: string;
  createdAt: string;
  profilepicture: string | null;
}

const UserProfile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [editingUsername, setEditingUsername] = useState<boolean>(false);
  const [newUsername, setNewUsername] = useState<string>('');
  const [newImage, setNewImage] = useState<File | null>(null)
    const {updateDetails}= useAuthStore()
  useEffect(() => {
    (async () => {
      try {
        const response = await FindUser();
        if (!response.data.success) throw response.data.message;
        setUser(response.data.user);
        setNewUsername(response.data.user.username);
      } catch (error) {
        console.error(error);
        alert(error);
      }
    })();
  }, []);

  const handleUpdateProfilePicture = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file: File = event.target.files?.[0] as File;
    setNewImage(file);
    
    if (file) {
      // Preview the image locally
      const reader = new FileReader();
      reader.onloadend = () => {
        if (user) setUser({ ...user, profilepicture: reader.result as string });
      };
      reader.readAsDataURL(file);
      
      // Upload the file to the backend
      try {
        const response = await UpdateProfile(file);
        alert(`Profile updated success`)
        console.log("Profile picture updated successfully:", response);
        updateDetails(user?.username as string, response.data.profile as string)

      } catch (error) {
        console.error("Error updating profile picture:", error);
      }
    }
  };

  const handleDeletePhoto = () => {
    if (user) setUser({ ...user, profilepicture: null });
  };

  const handleUsernameChange = () => {
    if (user) {
      setUser({ ...user, username: newUsername });
      setEditingUsername(false);
    }
  };

  if (!user) {
    return <div className="flex items-center justify-center h-screen text-gray-500">Loading user data...</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-purple-200 p-8">
      <div className="max-w-lg w-full bg-white p-10 rounded-2xl shadow-lg border border-gray-200 min-h-[550px] flex flex-col items-center justify-center">
        <div className="flex flex-col items-center space-y-6">
          {/* Profile Picture Section */}
          {user.profilepicture ? (
            <img src={user.profilepicture} alt="Profile" className="w-28 h-28 rounded-full shadow-md border-2 border-gray-300" />
          ) : (
            <div className="w-28 h-28 rounded-full bg-gray-300 flex items-center justify-center text-gray-500 shadow-md">
              No Photo
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <input type="file" accept="image/*" onChange={handleUpdateProfilePicture} className="hidden" id="profilePictureInput" />
            <label htmlFor="profilePictureInput" className="px-4 py-2 bg-blue-500 text-white text-sm font-semibold rounded-lg cursor-pointer hover:bg-blue-600 transition">
              Change Photo
            </label>
            <button onClick={handleDeletePhoto} className="px-4 py-2 bg-red-500 text-white text-sm font-semibold rounded-lg hover:bg-red-600 transition">
              Delete Photo
            </button>
          </div>
        </div>

        {/* User Details Section */}
        <div className="mt-8 text-center space-y-4 w-full">
          {editingUsername ? (
            <div className="flex justify-center items-center space-x-2">
              <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleUsernameChange}
                className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
              >
                Save
              </button>
            </div>
          ) : (
            <h2 onClick={() => setEditingUsername(true)} className="text-2xl font-bold cursor-pointer hover:text-blue-600 transition">
              {user.username} <span className="text-sm text-gray-500">(Click to edit)</span>
            </h2>
          )}
          <p className="text-gray-600 text-lg">{user.email}</p>
          <p className="text-sm text-gray-400">Joined: {new Date(user.createdAt).toDateString()}</p>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
