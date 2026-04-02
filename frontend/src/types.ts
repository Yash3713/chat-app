export interface AuthUser {
  _id: string;
  email: string;
  fullName: string;
  profilePicture: string;
}

export interface AuthImagePatternProps {
  title: string;
  subtitle: string;
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
