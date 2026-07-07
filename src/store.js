import { create } from 'zustand';

export const useStore = create((set) => (({
  styleCard: null,
  targetCards: [],
  styledCards: [],
  styleAnalysis: null,
  isProcessing: false,
  error: null,

  setStyleCard: (card) => set({ styleCard: card }),
  setTargetCards: (cards) => set({ targetCards: cards }),
  setStyledCards: (cards) => set({ styledCards: cards }),
  setStyleAnalysis: (analysis) => set({ styleAnalysis: analysis }),
  setIsProcessing: (isProcessing) => set({ isProcessing }),
  setError: (error) => set({ error }),
  
  reset: () => set({
    styleCard: null,
    targetCards: [],
    styledCards: [],
    styleAnalysis: null,
    isProcessing: false,
    error: null
  })
})));
