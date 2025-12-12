import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  userName: string | null;
  login: (name: string, token: string) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      userName: null,
      login: (name: string, token: string) => {
        set({ token, userName: name });
      },
      logout: () => {
        set({ token: null, userName: null });
      },
      isAuthenticated: () => {
        return !!get().token;
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token, userName: state.userName }),
    }
  )
);
