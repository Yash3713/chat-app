import { create } from "zustand";
import { axiosInstance } from "../axios";
import toast from "react-hot-toast";
import type { AuthUser, LogInFormData, SignUpFormData } from "../types";
import axios from "axios";

interface AuthStore {
  authUser: AuthUser | null;
  isCheckingAuth: boolean;
  isSigningUp: boolean;
  isLoggingIn:boolean;
  checkAuth: () => Promise<void>;
  signUp: (data: SignUpFormData) => Promise<void>;
  logOut: ()=> Promise<void>;
  logIn:(data:LogInFormData)=> Promise<void>
}

export const useAuthStore = create<AuthStore>((set) => ({
  authUser: null,
  isCheckingAuth: true,
  isSigningUp: false,
  isLoggingIn:false,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get<AuthUser>("auth/check");
      set({ authUser: res.data });
    } catch (error) {
      console.log(error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signUp: async (data: SignUpFormData) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post<AuthUser>("auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account Created Succesfully !!");
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message ?? "Something went wrong"
        : "Something went wrong";
      toast.error(message);
    } finally {
      set({ isSigningUp: false });
    }
  },
  logOut: async()=>{
    try {
      await axiosInstance.post("/auth/logout")
      set({authUser:null})
      toast.success("Logged Oiut Succesfully")
    } catch (error) {
       const message = axios.isAxiosError(error)
        ? error.response?.data?.message ?? "Something went wrong"
        : "Something went wrong";
      toast.error(message);
    }
  },
  logIn: async(data)=>{
    set({isLoggingIn:true})
    try {
      const res = await axiosInstance.post("/auth/login",data)
      set({authUser:res.data})
      toast.success("Logged In Succesfully")
    } catch (error) {const message = axios.isAxiosError(error)
        ? error.response?.data?.message ?? "Something went wrong"
        : "Something went wrong";
      toast.error(message);
    }finally{
      set({isLoggingIn:false})
    }
  }
}));
