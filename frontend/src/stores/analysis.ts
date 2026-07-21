import { create } from 'zustand';

export interface BackendAnalysisResponse {
  language: string;
  display_mode: string;
  script_detected: string;
  ancient_language: string;
  estimated_period: string;
  dynasty?: string;
  region?: string;
  original: string;
  transliteration: string;
  literal_translation?: string;
  translation: string;
  historical_analysis?: string;
  historical_context?: string;
  archaeological_notes?: string;
  alternative_interpretations?: string;
  error?: string;
  model?: string;
  confidence: number;
}

export interface AnalysisState {
  imagePreview: string | null;
  transcriptionText: string;
  detectedLanguage: string;
  confidence: number;
  warnings: string[];
  translationResult: BackendAnalysisResponse | null;

  setImagePreview: (img: string | null) => void;
  setOCRData: (data: { text: string; language: string; confidence: number; warnings?: string[] }) => void;
  setTranscriptionText: (text: string) => void;
  setTranslationResult: (result: BackendAnalysisResponse | null) => void;
  resetAnalysis: () => void;
}

export const useAnalysisStore = create<AnalysisState>((set) => ({
  imagePreview: null,
  transcriptionText: '',
  detectedLanguage: '',
  confidence: 0,
  warnings: [],
  translationResult: null,

  setImagePreview: (imagePreview) => set({ imagePreview }),
  setOCRData: ({ text, language, confidence, warnings = [] }) => set({ 
    transcriptionText: text, 
    detectedLanguage: language, 
    confidence, 
    warnings 
  }),
  setTranscriptionText: (transcriptionText) => set({ transcriptionText }),
  setTranslationResult: (translationResult) => set({ translationResult }),
  resetAnalysis: () => set({
    imagePreview: null,
    transcriptionText: '',
    detectedLanguage: '',
    confidence: 0,
    warnings: [],
    translationResult: null,
  }),
}));
