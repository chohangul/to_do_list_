import { create } from 'zustand';

type View = 'list' | 'calendar';
interface UiState {
  view: View;
  setView: (v: View) => void;
}

export const useUiStore = create<UiState>((set) => ({
  view: 'list',
  setView: (v) => set({ view: v }),
}));
