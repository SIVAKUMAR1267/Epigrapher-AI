import { create } from 'zustand';

export interface AnalysisState {
  imagePreview: string | null;
  transcriptionText: string;
  detectedLanguage: string;
  confidence: number;
  warnings: string[];
  translationResult: any | null;

  setImagePreview: (img: string | null) => void;
  setOCRData: (data: { text: string; language: string; confidence: number; warnings?: string[] }) => void;
  setTranscriptionText: (text: string) => void;
  setTranslationResult: (result: any) => void;
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
