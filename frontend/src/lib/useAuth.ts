import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from './api';
import { User, AuthResponse, LoginPayload, RegisterPayload } from '@/types';

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  clearError: () => void;
}

export const useAuth = create<AuthStore>()(
  persist(
    (set: (fn: (state: AuthStore) => Partial<AuthStore>) => void) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (payload: LoginPayload): Promise<void> => {
        set((): Partial<AuthStore> => ({ isLoading: true, error: null }));
        try {
          const response = await api.post<AuthResponse>('/auth/login', payload);
          const { accessToken, user } = response.data;

          if (typeof window !== 'undefined') {
            localStorage.setItem('accessToken', accessToken);
          }
          set((): Partial<AuthStore> => ({ user, isAuthenticated: true, isLoading: false }));
        } catch (error: unknown) {
          const errorMessage = (error as any)?.response?.data?.message || 'Error al iniciar sesión';
          set((): Partial<AuthStore> => ({ error: errorMessage, isLoading: false }));
          throw error;
        }
      },

      register: async (payload: RegisterPayload): Promise<void> => {
        set((): Partial<AuthStore> => ({ isLoading: true, error: null }));
        try {
          const response = await api.post<AuthResponse>(
            '/auth/register',
            payload
          );
          const { accessToken, user } = response.data;

          if (typeof window !== 'undefined') {
            localStorage.setItem('accessToken', accessToken);
          }
          set((): Partial<AuthStore> => ({ user, isAuthenticated: true, isLoading: false }));
        } catch (error: unknown) {
          const errorMessage = (error as any)?.response?.data?.message || 'Error al registrarse';
          set((): Partial<AuthStore> => ({ error: errorMessage, isLoading: false }));
          throw error;
        }
      },

      logout: (): void => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('accessToken');
        }
        set((): Partial<AuthStore> => ({ user: null, isAuthenticated: false }));
      },

      updateProfile: async (data: Partial<User>): Promise<void> => {
        set((): Partial<AuthStore> => ({ isLoading: true, error: null }));
        try {
          const response = await api.put<User>('/auth/profile', data);
          set((): Partial<AuthStore> => ({ user: response.data, isLoading: false }));
        } catch (error: unknown) {
          const errorMessage = (error as any)?.response?.data?.message || 'Error al actualizar perfil';
          set((): Partial<AuthStore> => ({ error: errorMessage, isLoading: false }));
          throw error;
        }
      },

      clearError: (): void => {
        set((): Partial<AuthStore> => ({ error: null }));
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state: AuthStore) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
