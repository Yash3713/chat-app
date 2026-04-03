export interface AuthUser {
  _id: string;
  fullName: string;
  email: string;
  profilePicture: string;
  createdAt: string;
}

export interface SignUpFormData {
  fullName: string;
  email: string;
  password: string;
  profilePicture? : unknown;
}

export interface LogInFormData {
  email: string;
  password: string;
}

export interface UpdateProfileData {
  profilePicture: string;
}

export type AuthError = string | null;