export interface AuthUser {
  _id: string;
  fullName: string;
  email: string;
  profilePic: string;
  createdAt: string;
}

export interface SignUpFormData {
  fullName: string;
  email: string;
  password: string;
}

export interface LogInFormData {
  email: string;
  password: string;
}

export type AuthError = string | null;