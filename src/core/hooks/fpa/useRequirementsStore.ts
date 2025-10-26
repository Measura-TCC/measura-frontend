import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Requirement, RequirementSource, ComponentType } from "@/core/types/fpa";

interface RequirementsStore {
  substep: "import" | "classification" | "specification";
  requirements: Requirement[];

  setSubstep: (substep: "import" | "classification" | "specification") => void;
  addRequirement: (requirement: { title: string; description?: string; source: RequirementSource }) => void;
  addRequirements: (requirements: Array<{ title: string; description?: string; source: RequirementSource }>) => void;
  removeRequirement: (requirementId: string) => void;
  classifyRequirement: (requirementId: string, componentType: ComponentType) => void;
  updateRequirementFpaData: (requirementId: string, fpaData: Record<string, unknown>) => void;
  resetRequirements: () => void;
}

const initialState = {
  substep: "import" as const,
  requirements: [] as Requirement[],
};

export const useRequirementsStore = create<RequirementsStore>()(
  persist(
    (set) => ({
      ...initialState,

      setSubstep: (substep) => {
        set({ substep });
      },

      addRequirement: (requirement) => {
        set((state) => ({
          requirements: [
            ...state.requirements,
            {
              ...requirement,
              _id: `temp-${Date.now()}`,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            } as Requirement,
          ],
        }));
      },

      addRequirements: (newRequirements) => {
        const timestamp = Date.now();
        const requirementsWithIds = newRequirements.map((req, index) => ({
          ...req,
          _id: `temp-${timestamp}-${index}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })) as Requirement[];

        set((state) => ({
          requirements: [...state.requirements, ...requirementsWithIds],
        }));
      },

      removeRequirement: (requirementId) => {
        set((state) => ({
          requirements: state.requirements.filter((req) => req._id !== requirementId),
        }));
      },

      classifyRequirement: (requirementId, componentType) => {
        set((state) => ({
          requirements: state.requirements.map((req) =>
            req._id === requirementId ? { ...req, componentType } : req
          ),
        }));
      },

      updateRequirementFpaData: (requirementId, fpaData) => {
        set((state) => ({
          requirements: state.requirements.map((req) =>
            req._id === requirementId
              ? {
                  ...req,
                  ...fpaData,
                  componentId: `component-${requirementId}-${Date.now()}`,
                }
              : req
          ),
        }));
      },

      resetRequirements: () => {
        set(initialState);
      },
    }),
    {
      name: "fpa-requirements-storage",
      partialize: (state) => ({
        substep: state.substep,
        requirements: state.requirements,
      }),
    }
  )
);
