import { create } from 'zustand';

export const AppPhase = {
  Upload: 0,
  ProcessingOCR: 1,
  Review: 2,
  ProcessingTranslation: 3,
  Results: 4,
  Error: 5,
} as const;

export type AppPhase = typeof AppPhase[keyof typeof AppPhase];

export interface WorkflowState {
  phase: AppPhase;
  errorMessage: string;
  setPhase: (phase: AppPhase) => void;
  setErrorMessage: (msg: string) => void;
  resetWorkflow: () => void;
}

export const useWorkflowStore = create<WorkflowState>((set) => ({
  phase: AppPhase.Upload,
  errorMessage: '',
  setPhase: (phase) => set({ phase, errorMessage: phase === AppPhase.Error ? undefined : '' }),
  setErrorMessage: (errorMessage) => set({ errorMessage, phase: AppPhase.Error }),
  resetWorkflow: () => set({ phase: AppPhase.Upload, errorMessage: '' }),
}));
