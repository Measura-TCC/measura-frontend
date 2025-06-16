import { useState, useEffect, useCallback } from "react";
import type { EstimateResponse } from "@/core/services/fpa/estimates";

export type Step = 1 | 2 | 3 | 4 | 5;
export type ComponentType = "ALI" | "EI" | "EO" | "EQ" | "AIE";

export interface WorkflowState {
  currentStep: Step;
  selectedProjectId: string | null;
  createdEstimate: EstimateResponse | null;
  isCalculationComplete: boolean;
  selectedComponentType: ComponentType | null;
  step1Data: {
    selectedProjectId?: string;
    newProjectData?: Record<string, unknown>;
  };
  step2Data: {
    name?: string;
    description?: string;
    applicationBoundary?: string;
    countingScope?: string;
    countType?: string;
    averageDailyWorkingHours?: number;
    teamSize?: number;
    hourlyRateBRL?: number;
  };
  step4Data: {
    productivityFactor?: number;
    generalSystemCharacteristics?: number[];
    notes?: string;
  };
}

const DEFAULT_STATE: WorkflowState = {
  currentStep: 1,
  selectedProjectId: null,
  createdEstimate: null,
  isCalculationComplete: false,
  selectedComponentType: null,
  step1Data: {},
  step2Data: {
    averageDailyWorkingHours: 8,
    teamSize: 4,
    hourlyRateBRL: 150,
  },
  step4Data: {
    productivityFactor: 10,
  },
};

const STORAGE_KEY = "fpa-workflow-state";

export const useWorkflowState = () => {
  const [state, setState] = useState<WorkflowState>(DEFAULT_STATE);

  useEffect(() => {
    try {
      const savedState = localStorage.getItem(STORAGE_KEY);
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        setState({ ...DEFAULT_STATE, ...parsedState });
      }
    } catch (e) {
      if (process.env.NODE_ENV === "development") {
        console.warn("[useWorkflowState] Failed to restore state", e);
      }
    }
  }, []);

  const saveState = useCallback((newState: Partial<WorkflowState>) => {
    setState((prevState) => {
      const updatedState = { ...prevState, ...newState };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedState));
      } catch {
        // Ignore error
      }
      return updatedState;
    });
  }, []);

  const setCurrentStep = useCallback(
    (step: Step) => {
      saveState({ currentStep: step });
    },
    [saveState]
  );

  const setSelectedProjectId = useCallback(
    (projectId: string | null) => {
      saveState({
        selectedProjectId: projectId,
        step1Data: {
          ...state.step1Data,
          selectedProjectId: projectId || undefined,
        },
      });
    },
    [saveState, state.step1Data]
  );

  const setCreatedEstimate = useCallback(
    (estimate: EstimateResponse | null) => {
      saveState({ createdEstimate: estimate });
    },
    [saveState]
  );

  const setCalculationComplete = useCallback(
    (complete: boolean) => {
      saveState({ isCalculationComplete: complete });
    },
    [saveState]
  );

  const setSelectedComponentType = useCallback(
    (type: ComponentType | null) => {
      saveState({ selectedComponentType: type });
    },
    [saveState]
  );

  const updateStep2Data = useCallback(
    (data: Partial<WorkflowState["step2Data"]>) => {
      saveState({
        step2Data: { ...state.step2Data, ...data },
      });
    },
    [saveState, state.step2Data]
  );

  const updateStep4Data = useCallback(
    (data: Partial<WorkflowState["step4Data"]>) => {
      saveState({
        step4Data: { ...state.step4Data, ...data },
      });
    },
    [saveState, state.step4Data]
  );

  const resetWorkflow = useCallback(() => {
    setState(DEFAULT_STATE);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore error
    }
  }, []);

  const canNavigateToStep = useCallback(
    (step: Step) => {
      if (step === 1) return true;
      if (step === 2) return state.selectedProjectId !== null;
      if (step === 3) return state.createdEstimate !== null;
      if (step === 4) return state.createdEstimate !== null;
      if (step === 5) return state.createdEstimate !== null;
      return false;
    },
    [state.selectedProjectId, state.createdEstimate]
  );

  return {
    state,
    setCurrentStep,
    setSelectedProjectId,
    setCreatedEstimate,
    setCalculationComplete,
    setSelectedComponentType,
    updateStep2Data,
    updateStep4Data,
    resetWorkflow,
    canNavigateToStep,
  };
};
