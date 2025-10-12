import { useWorkflowState } from "@/core/hooks/fpa/useWorkflowState";
import { v4 as uuidv4 } from "uuid";
import type { Requirement, ComponentType } from "@/core/types/fpa";

export const useRequirements = () => {
  const { state, updateStep3Data } = useWorkflowState();
  const { requirements, classifiedRequirements } = state.step3Data;

  const addRequirement = (req: Omit<Requirement, "id">) => {
    const newRequirement: Requirement = {
      ...req,
      id: uuidv4(),
    };

    updateStep3Data({
      requirements: [...requirements, newRequirement],
    });
  };

  const addMultipleRequirements = (reqs: Omit<Requirement, "id">[]) => {
    const newRequirements = reqs.map((req) => ({
      ...req,
      id: uuidv4(),
    }));

    updateStep3Data({
      requirements: [...requirements, ...newRequirements],
    });
  };

  const classifyRequirement = (id: string, componentType: ComponentType) => {
    const updatedRequirements = requirements.map((req) =>
      req.id === id ? { ...req, componentType } : req
    );

    updateStep3Data({
      requirements: updatedRequirements,
    });
  };

  const updateRequirementFpaData = (
    id: string,
    fpaData: Record<string, unknown>
  ) => {
    const updatedRequirements = requirements.map((req) =>
      req.id === id ? { ...req, fpaData } : req
    );

    updateStep3Data({
      requirements: updatedRequirements,
    });
  };

  const getUnclassified = () => {
    return requirements.filter((req) => !req.componentType);
  };

  const getClassified = () => {
    return requirements.filter((req) => req.componentType);
  };

  const getByComponentType = (componentType: ComponentType) => {
    return requirements.filter((req) => req.componentType === componentType);
  };

  return {
    requirements,
    addRequirement,
    addMultipleRequirements,
    classifyRequirement,
    updateRequirementFpaData,
    getUnclassified,
    getClassified,
    getByComponentType,
  };
};
