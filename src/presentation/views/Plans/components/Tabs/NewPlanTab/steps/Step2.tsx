import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
} from "@/presentation/components/primitives";
import { availableObjectives } from "../utils/stepData";
import type { Objective } from "../utils/types";
import { useProjects } from "@/core/hooks/projects/useProjects";
import { useProjectObjectives } from "@/core/hooks/projects/useProjectObjectives";
import { useOrganizationalObjectives } from "@/core/hooks/organizations";

interface Step2Props {
  selectedObjectives: Objective[];
  onAddObjective: (objective: Objective) => void;
  onRemoveObjective: (objectiveTitle: string) => void;
  onNext: () => void;
}

export const Step2: React.FC<Step2Props> = ({
  selectedObjectives,
  onAddObjective,
  onRemoveObjective,
  onNext,
}) => {
  const { t } = useTranslation("plans");
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const { projects } = useProjects();
  const { projectObjectives } = useProjectObjectives(selectedProjectId || null);
  const { objectives: organizationalObjectives } = useOrganizationalObjectives();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("workflow.steps.step2.title")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-secondary mb-4">
          {t("workflow.steps.step2.description")}
        </p>

        <div className="space-y-6">
          <div>
            <h4 className="font-medium mb-2">
              {t("workflow.planObjectives")}
            </h4>
            <div className="space-y-2">
              <div className="relative">
                <select
                  className="w-full p-2 border border-border rounded-md appearance-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  value=""
                  onChange={(e) => {
                    if (e.target.value) {
                      const objective = availableObjectives.find(
                        (obj) => obj.objectiveTitle === e.target.value
                      );
                      if (objective) {
                        onAddObjective(objective);
                        e.target.value = "";
                      }
                    }
                  }}
                >
                  <option value="">{t("workflow.chooseMeasurementObjective")}</option>
                  {availableObjectives
                    .filter(
                      (obj) =>
                        !selectedObjectives.some(
                          (selected) =>
                            selected.objectiveTitle === obj.objectiveTitle
                        )
                    )
                    .map((objective) => (
                      <option
                        key={objective.objectiveTitle}
                        value={objective.objectiveTitle}
                      >
                        {t(objective.objectiveTitle)}
                      </option>
                    ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </div>
              </div>

              {selectedObjectives.length > 0 && (
                <div className="mt-3">
                  <div className="flex flex-wrap gap-2">
                    {selectedObjectives.map((objective) => (
                      <div
                        key={objective.objectiveTitle}
                        className="inline-flex items-center bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
                      >
                        <span>{t(objective.objectiveTitle)}</span>
                        <button
                          className="ml-2 text-primary hover:text-primary/70"
                          onClick={() =>
                            onRemoveObjective(objective.objectiveTitle)
                          }
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="border-t pt-4">
            <h4 className="font-medium mb-2">
              {t("workflow.projectObjectives")}
            </h4>
            <div className="space-y-3">
              <div className="relative">
                <select
                  className="w-full p-2 border border-border rounded-md appearance-none bg-white"
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                >
                  <option value="">{t("workflow.selectProject")}</option>
                  {projects?.map((project) => (
                    <option key={project._id} value={project._id}>
                      {project.name}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </div>
              </div>

              {selectedProjectId && projectObjectives.length > 0 && (
                <div className="space-y-2">
                  {projectObjectives.map((projectObj) => (
                    <div
                      key={projectObj._id}
                      className="p-3 border border-border rounded-md bg-background-secondary"
                    >
                      <div className="font-medium text-sm">{projectObj.title}</div>
                      <div className="text-xs text-secondary mt-1">{projectObj.description}</div>
                      {projectObj.organizationalObjectiveIds && projectObj.organizationalObjectiveIds.length > 0 && (
                        <div className="text-xs text-primary mt-2">
                          {t("workflow.linkedTo")} {projectObj.organizationalObjectiveIds
                            .map(id => organizationalObjectives.find(org => org._id === id)?.title)
                            .filter(Boolean)
                            .join(", ")}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {selectedProjectId && projectObjectives.length === 0 && (
                <div className="text-sm text-secondary p-3 text-center">
                  {t("workflow.noObjectivesFound")}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-2 mt-6">
          {selectedObjectives.length > 0 && (
            <Button onClick={onNext} variant="primary">
              {t("workflow.nextQuestions")}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
