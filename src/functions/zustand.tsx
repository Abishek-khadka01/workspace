import { create } from 'zustand';

const useAuthStore = create((set) => ({
  isLogin: false,
  name:"",
  url :"",
  setLoginTrue: () => set({ isLogin: true }),

  setLoginFalse: () => set({ isLogin: false }),

}));

export default useAuthStore;
