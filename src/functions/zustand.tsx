import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type AuthState = {
  isLogin: boolean;
  username: string;
  url: string;
  id: null | string;
  setLoginTrue: (username: string, url: string, id: string) => void;
  setLoginFalse: () => void;
  getDatas: () => AuthState;
  updateDetails: (username: string, url: string) => void;
  timestamp: number;
};

const EXPIRATION_TIME = 5 * 24 * 60 * 60 * 1000; // 5 days in milliseconds

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isLogin: false,
      id: null,
      username: "",
      url: "",
      timestamp: 0,
      setLoginTrue: (username: string, profilePicture: string, id: string) => {
        set({
          isLogin: true,
          username,
          url: profilePicture,
          id,
          timestamp: Date.now(), // Store current time as a timestamp
        });
      },
      setLoginFalse: () => {
        set({
          isLogin: false,
          username: "",
          url: "",
          id: null,
          timestamp: 0, // Reset timestamp on logout
        });
      },
      updateDetails: (username: string, url: string) => {
        set({
          username,
          url,
        });
      },
      getDatas: () => {
        const state = get();
        const currentTime = Date.now();
        // Check if the stored data has expired (based on the timestamp)
        if (state.timestamp && currentTime - state.timestamp > EXPIRATION_TIME) {
          set({
            isLogin: false,
            username: "",
            url: "",
            id: null,
            timestamp: 0, // Clear expired data
          });
        }
        return state;
      },
    }),
    {
      name: "auth-storage", // Key for local storage
      storage: createJSONStorage(() => localStorage)
    }
  )
);

export default useAuthStore;