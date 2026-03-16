import { create } from 'zustand';

interface AuthState {
  user: any | null;
  isOpen: boolean;
  setUser: (user: any) => void;
  openModal: () => void;
  closeModal: () => void;
  logout: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  isOpen: false,
  setUser: (user) => set({ user }),
  openModal: () => set({ isOpen: true }),
  closeModal: () => set({ isOpen: false }),
  logout: () => {
    localStorage.removeItem('harvest_user');
    set({ user: null });
  },
}));
