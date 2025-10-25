import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { EstimateResponse } from "@/core/services/estimateService";
import type { ComponentType } from "@/core/types/fpa";

export type Step = 1 | 2 | 3 | 4 | 5 | 6;

export interface EstimateFormData {
  name: string;
  description: string;
  applicationBoundary: string;
  countingScope: string;
  countType: "DEVELOPMENT_PROJECT" | "ENHANCEMENT_PROJECT" | "APPLICATION_PROJECT";
  teamSize?: number;
  hourlyRateBRL?: number;
  productivityFactor?: number;
  averageDailyWorkingHours?: number;
}

interface FPAWorkflowStore {
  currentStep: Step;
  selectedProjectId: string | null;
  estimateFormData: EstimateFormData | null;
  generalSystemCharacteristics: number[] | null;
  createdEstimate: EstimateResponse | null;
  isCalculationComplete: boolean;
  selectedComponentType: ComponentType | null;

  setCurrentStep: (step: Step) => void;
  setSelectedProjectId: (projectId: string | null) => void;
  setEstimateFormData: (data: EstimateFormData) => void;
  setGeneralSystemCharacteristics: (gsc: number[]) => void;
  setCreatedEstimate: (estimate: EstimateResponse | null) => void;
  setCalculationComplete: (complete: boolean) => void;
  setSelectedComponentType: (type: ComponentType | null) => void;
  resetWorkflow: () => void;
  canNavigateToStep: (step: Step) => boolean;
}

const initialState = {
  currentStep: 1 as Step,
  selectedProjectId: null,
  estimateFormData: null,
  generalSystemCharacteristics: null,
  createdEstimate: null,
  isCalculationComplete: false,
  selectedComponentType: null,
};

export const useFPAWorkflowStore = create<FPAWorkflowStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      setCurrentStep: (step) => {
        console.log("🔍 [STORE] setCurrentStep called with step:", step);
        console.log("🔍 [STORE] Current step before:", get().currentStep);
        const canNavigate = get().canNavigateToStep(step);
        console.log("🔍 [STORE] canNavigateToStep result:", canNavigate);
        if (canNavigate) {
          set({ currentStep: step });
          console.log("🔍 [STORE] Current step after set:", step);
        } else {
          console.log("🔍 [STORE] Navigation blocked to step:", step);
        }
      },

      setSelectedProjectId: (projectId) => {
        set({ selectedProjectId: projectId });
      },

      setEstimateFormData: (data) => {
        set({ estimateFormData: data });
      },

      setGeneralSystemCharacteristics: (gsc) => {
        console.log("🔍 [STORE] setGeneralSystemCharacteristics called with:", gsc);
        console.log("🔍 [STORE] Previous GSC:", get().generalSystemCharacteristics);
        set({ generalSystemCharacteristics: gsc });
        console.log("🔍 [STORE] GSC updated to:", gsc);
      },

      setCreatedEstimate: (estimate) => {
        set({ createdEstimate: estimate });
      },

      setCalculationComplete: (complete) => {
        set({ isCalculationComplete: complete });
      },

      setSelectedComponentType: (type) => {
        set({ selectedComponentType: type });
      },

      resetWorkflow: () => {
        set(initialState);
      },

      canNavigateToStep: (step) => {
        const state = get();

        if (step === 1) return true;
        if (step === 2) return state.selectedProjectId !== null;
        if (step === 3) return state.estimateFormData !== null && state.currentStep >= 2;
        if (step === 4) return state.currentStep >= 3;
        if (step === 5) return state.currentStep >= 4;
        if (step === 6) return state.estimateFormData !== null && state.currentStep >= 5;

        return false;
      },
    }),
    {
      name: "fpa-workflow-storage",
      partialize: (state) => ({
        currentStep: state.currentStep,
        selectedProjectId: state.selectedProjectId,
        estimateFormData: state.estimateFormData,
        generalSystemCharacteristics: state.generalSystemCharacteristics,
        createdEstimate: state.createdEstimate,
        isCalculationComplete: state.isCalculationComplete,
      }),
    }
  )
);
