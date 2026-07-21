import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark' | 'system';
type DisplayMode = 'side-by-side' | 'stacked';
type AnalysisDisplayMode = 'target' | 'bilingual' | 'english' | 'research';
type TransliterationStyle = 'scholarly' | 'accessible';
type Language = 'en' | 'fr' | 'de' | 'es' | 'it' | 'gr' | 'he' | 'ar' | 'ta' | 'hi' | 'te' | 'kn' | 'ml' | 'mr' | 'bn' | 'ur' | 'sa' | 'gu' | 'or' | 'pa' | 'ja' | 'zh' | 'el';

export interface SettingsState {
  theme: Theme;
  language: Language;
  defaultTargetLanguage: Language;
  displayMode: DisplayMode;
  analysisDisplayMode: AnalysisDisplayMode;
  transliterationStyle: TransliterationStyle;
  autoOcr: boolean;
  saveHistory: boolean;
  analyticsEnabled: boolean;
  
  // Actions
  setTheme: (theme: Theme) => void;
  setLanguage: (lang: Language) => void;
  setDefaultTargetLanguage: (lang: Language) => void;
  setDisplayMode: (mode: DisplayMode) => void;
  setAnalysisDisplayMode: (mode: AnalysisDisplayMode) => void;
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
  analysisDisplayMode: 'target' as AnalysisDisplayMode,
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
      setAnalysisDisplayMode: (analysisDisplayMode) => set({ analysisDisplayMode }),
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
