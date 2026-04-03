import { create } from "zustand";
import type {
  AuthError,
  AuthUser,
  LogInFormData,
  SignUpFormData,
} from "../types/api/auth";
import { devtools } from "zustand/middleware";
import { authApi } from "../api/auth.api";
import { getErrorMessage } from "../utils";

// State
interface AuthState {
  authUser: AuthUser | null;
  isCheckingAuth: boolean;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  isLoggingOut: boolean;
  error: AuthError;
}
//Actions
interface AuthAction {
  checkAuth: () => Promise<void>;
  signUp: (
    data: SignUpFormData,
  ) => Promise<{ success: boolean; error?: string }>;
  logIn: (data: LogInFormData) => Promise<{ success: boolean; error?: string }>;
  logOut: () => Promise<{ success: boolean; error?: string }>;
  clearError: () => void;
  reset: () => void;
}

type AuthStore = AuthState & AuthAction;

const initialState: AuthState = {
  authUser: null,
  isCheckingAuth: true,
  isSigningUp: false,
  isLoggingIn: false,
  isLoggingOut: false,
  error: null,
};

export const useAuthStore = create<AuthStore>()(
  devtools(
    (set) => ({
      ...initialState,

      // Auth check on app load
      checkAuth: async () => {
        try {
          const res = await authApi.checkAuth();
          set({ authUser: res.data }, false, "checkAuth/success");
        } catch {
          set({ authUser: null }, false, "checkAuth/failure");
        } finally {
          set({ isCheckingAuth: false }, false, "checkAuth/done");
        }
      },

      signUp: async (data) => {
        set({ isSigningUp: true, error: null }, false, "signUp/start");
        try {
          const res = await authApi.signUp(data);
          set({ authUser: res.data }, false, "signUp/success");
          return { success: true };
        } catch (error) {
          const message = getErrorMessage(error);
          set({ error: message }, false, "signUp/failure");
          return { success: false, error: message };
        } finally {
          set({ isSigningUp: false }, false, "signUp/done");
        }
      },

      logIn: async (data) => {
        set({ isLoggingIn: true, error: null }, false, "logIn/start");
        try {
          const res = await authApi.logIn(data);
          set({ authUser: res.data }, false, "logIn/success");
          return { success: true };
        } catch (error) {
          const message = getErrorMessage(error);
          set({ error: message }, false, "logIn/failure");
          return { success: false, error: message };
        } finally {
          set({ isLoggingIn: false }, false, "logIn/done");
        }
      },

      logOut: async () => {
        set({ isLoggingOut: true, error: null }, false, "logOut/start");
        try {
          await authApi.logOut();
          set({ authUser: null }, false, "logOut/success");
          return { success: true };
        } catch (error) {
          const message = getErrorMessage(error);
          set({ error: message }, false, "logOut/failure");
          return { success: false, error: message };
        } finally {
          set({ isLoggingOut: false }, false, "logOut/done");
        }
      },

      clearError: () => set({ error: null }, false, "clearError"),

      // wipe entire auth state
      reset: () => set(initialState, false, "reset"),
    }),
    { name: "AuthStore" },
  ),
);

// Selector Hooks
export const useAuthUser = () => useAuthStore((s) => s.authUser);
export const useAuthError = () => useAuthStore((s) => s.error);
export const useIsCheckingAuth = () => useAuthStore((s) => s.isCheckingAuth);
export const useIsLoggingIn = () => useAuthStore((s) => s.isLoggingIn);
export const useIsSigningUp = () => useAuthStore((s) => s.isSigningUp);
export const useIsLoggingOut = () => useAuthStore((s) => s.isLoggingOut);
