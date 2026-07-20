import { create } from 'zustand';

export interface UIState {
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
  setMobileMenuOpen: (isOpen: boolean) => void;
  
  // Modals state can be managed via React Router or local state, 
  // but keeping global UI state here helps with cross-component triggers.
  activeModal: 'none' | 'settings' | 'help' | 'disclaimer';
  setActiveModal: (modal: 'none' | 'settings' | 'help' | 'disclaimer') => void;
}

export const useUIStore = create<UIState>((set) => ({
  isMobileMenuOpen: false,
  toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
  setMobileMenuOpen: (isOpen) => set({ isMobileMenuOpen: isOpen }),
  
  activeModal: 'none',
  setActiveModal: (modal) => set({ activeModal: modal }),
}));
