import { axiosInstance } from "../axios";
import type { AuthUser, LogInFormData, SignUpFormData, UpdateProfileData } from "../types/api/auth";


export const authApi = {
  checkAuth: () =>
    axiosInstance.get<AuthUser>("auth/check"),

  signUp: (data: SignUpFormData) =>
    axiosInstance.post<AuthUser>("auth/signup", data),

  logIn: (data: LogInFormData) =>
    axiosInstance.post<AuthUser>("auth/login", data),

  logOut: () =>
    axiosInstance.post("auth/logout"),

  updateProfile: (data: UpdateProfileData) =>
    axiosInstance.post<AuthUser>("auth/update-profile", data),
};