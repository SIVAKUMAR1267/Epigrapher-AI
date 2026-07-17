import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark' | 'system';
type DisplayMode = 'side-by-side' | 'stacked';
type TransliterationStyle = 'scholarly' | 'accessible';
type Language = 'en' | 'fr' | 'de' | 'es' | 'it' | 'gr' | 'he' | 'ar';

export interface SettingsState {
  theme: Theme;
  language: Language;
  defaultTargetLanguage: Language;
  displayMode: DisplayMode;
  transliterationStyle: TransliterationStyle;
  autoOcr: boolean;
  saveHistory: boolean;
  analyticsEnabled: boolean;
  
  // Actions
  setTheme: (theme: Theme) => void;
  setLanguage: (lang: Language) => void;
  setDefaultTargetLanguage: (lang: Language) => void;
  setDisplayMode: (mode: DisplayMode) => void;
  setTransliterationStyle: (style: TransliterationStyle) => void;
  setAutoOcr: (auto: boolean) => void;
  setSaveHistory: (save: boolean) => void;
  setAnalyticsEnabled: (enabled: boolean) => void;
  resetSettings: () => void;
}

const initialState = {
  theme: 'system' as Theme,
  language: 'en' as Language,
  defaultTargetLanguage: 'en' as Language,
  displayMode: 'side-by-side' as DisplayMode,
  transliterationStyle: 'scholarly' as TransliterationStyle,
  autoOcr: false,
  saveHistory: true,
  analyticsEnabled: false,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...initialState,
      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => set({ language }),
      setDefaultTargetLanguage: (defaultTargetLanguage) => set({ defaultTargetLanguage }),
      setDisplayMode: (displayMode) => set({ displayMode }),
      setTransliterationStyle: (transliterationStyle) => set({ transliterationStyle }),
      setAutoOcr: (autoOcr) => set({ autoOcr }),
      setSaveHistory: (saveHistory) => set({ saveHistory }),
      setAnalyticsEnabled: (analyticsEnabled) => set({ analyticsEnabled }),
      resetSettings: () => set(initialState),
    }),
    {
      name: 'epigrapher-settings', // key in localStorage
    }
  )
);
