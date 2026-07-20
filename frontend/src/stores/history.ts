import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface HistoryEntry {
  id: string;
  date: string;
  thumbnailUrl: string; // Base64 or object URL
  script: string | null;
  language: string | null;
  confidence: number | null;
  targetLanguage: string;
  transcription: string;
  translation: string;
  notes?: string;
}

export interface HistoryState {
  entries: HistoryEntry[];
  addEntry: (entry: Omit<HistoryEntry, 'id' | 'date'>) => void;
  removeEntry: (id: string) => void;
  clearHistory: () => void;
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set) => ({
      entries: [],
      addEntry: (entry) => set((state) => ({
        entries: [
          {
            ...entry,
            id: crypto.randomUUID(),
            date: new Date().toISOString(),
          },
          ...state.entries
        ]
      })),
      removeEntry: (id) => set((state) => ({
        entries: state.entries.filter((e) => e.id !== id)
      })),
      clearHistory: () => set({ entries: [] }),
    }),
    {
      name: 'epigrapher-history',
    }
  )
);
