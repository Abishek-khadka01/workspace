
import { create } from "zustand";
import { persist } from "zustand/middleware";

type AuthState = {
  isLogin: boolean;
  username: string;
  url: string;
  id:null | string
  setLoginTrue: (username: string, url: string, id: string) => void;
  setLoginFalse: () => void;
  getDatas: () => AuthState;
  updateDetails : (username : string , url : string)=>void
};


const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isLogin: false,
      id:null,
      username: "",
      url: "",

      setLoginTrue: (username: string, profilePicture: string, id: string) => {
        set({
          isLogin: true,
          username,
          url: profilePicture,
          id
        });
      },

      setLoginFalse: () => {
        set({
          isLogin: false,
          username: "",
          url: "",
          id:null,
        });
      },

      updateDetails: (username: string , url: string )=>{
        set({
          username,
          url,
        })
      },

      getDatas: () => get(),
    }),
    {
      name: "auth-storage", // Key for local storage
    }
  )
);






export default useAuthStore;
