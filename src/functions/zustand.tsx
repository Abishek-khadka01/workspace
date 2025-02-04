import { create } from "zustand";
import { persist } from "zustand/middleware";

type AuthState = {
  isLogin: boolean;
  username: string;
  url: string;
  setLoginTrue: (username: string, url: string) => void;
  setLoginFalse: () => void;
  getDatas: () => AuthState;
};

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isLogin: false,
      username: "",
      url: "",

      setLoginTrue: (username: string, url: string) => {
        set({
          isLogin: true,
          username,
          url,
        });
      },

      setLoginFalse: () => {
        set({
          isLogin: false,
          username: "",
          url: "",
        });
      },

      getDatas: () => get(),
    }),
    {
      name: "auth-storage", // Key for local storage
    }
  )
);

export default useAuthStore;
