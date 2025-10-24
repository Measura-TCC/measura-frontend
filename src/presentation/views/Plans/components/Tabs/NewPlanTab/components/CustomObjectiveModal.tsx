import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Button,
  Input,
  Tabs,
} from "@/presentation/components/primitives";
import type { Objective } from "../utils/types";
import { availableObjectives } from "../utils/stepData";

interface CustomObjectiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddObjective: (objective: Objective) => void;
  existingObjectives?: Objective[];
  editingData?: Objective;
}

export const CustomObjectiveModal: React.FC<CustomObjectiveModalProps> = ({
  isOpen,
  onClose,
  onAddObjective,
  existingObjectives = [],
  editingData,
}) => {
  const { t } = useTranslation("plans");
  const [selectedTab, setSelectedTab] = useState(editingData ? "custom" : "predefined");
  const [customObjective, setCustomObjective] = useState<Omit<Objective, "questions">>({
    objectiveTitle: editingData?.objectiveTitle || "",
  });

  const handleAddPredefinedObjective = (objective: Objective) => {
    onAddObjective(objective);
    onClose();
  };

  const handleCreateCustomObjective = () => {
    if (!customObjective.objectiveTitle.trim()) return;

    const newObjective: Objective = {
      ...customObjective,
      questions: [], // Start with empty questions array
    };

    onAddObjective(newObjective);
    onClose();

    // Reset form
    setCustomObjective({
      objectiveTitle: "",
    });
  };

  const handleClose = () => {
    setSelectedTab("predefined");
    setCustomObjective({
      objectiveTitle: "",
    });
    onClose();
  };

  if (!isOpen) return null;

  // Filter out already added objectives
  const availableToAdd = availableObjectives.filter(
    (obj) =>
      !existingObjectives.some(
        (existing) => existing.objectiveTitle === obj.objectiveTitle
      )
  );

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-white/20 flex items-center justify-center z-50" onClick={handleClose}>
      <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto shadow-xl border" onClick={(e) => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">
              {editingData ? t("editObjective") : t("modals.customObjective.title")}
            </h2>
            <button onClick={handleClose} className="text-gray-500 hover:text-gray-700 cursor-pointer text-2xl leading-none">
              ×
            </button>
          </div>

          {!editingData && (
            <div className="mb-4">
              <Tabs
                tabs={[
                  { id: "predefined", label: t("modals.customObjective.predefinedTab") },
                  { id: "custom", label: t("modals.customObjective.customTab") },
                ]}
                activeTab={selectedTab}
                onTabChange={setSelectedTab}
              />
            </div>
          )}

          {!editingData && selectedTab === 'predefined' && (
            <div className="space-y-4">
              <p className="text-secondary text-sm mb-4">
                {t("modals.customObjective.predefinedDescription")}
              </p>
              {availableToAdd.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>{t("modals.customObjective.noAvailableObjectives")}</p>
                </div>
              ) : (
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {availableToAdd.map((objective) => (
                    <div
                      key={objective.objectiveTitle}
                      className="border border-border rounded-lg p-3 hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleAddPredefinedObjective(objective)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-default text-sm">
                            {t(objective.objectiveTitle)}
                          </h4>
                        </div>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddPredefinedObjective(objective);
                          }}
                        >
                          {t("modals.customObjective.addButton")}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {(editingData || selectedTab === 'custom') && (
            <div className="space-y-4">
              {!editingData && (
                <p className="text-secondary text-sm mb-4">
                  {t("modals.customObjective.customDescription")}
                </p>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-default mb-1">
                    {t("objective.objectiveTitle")} *
                  </label>
                  <Input
                    value={customObjective.objectiveTitle}
                    onChange={(e) => setCustomObjective(prev => ({ ...prev, objectiveTitle: e.target.value }))}
                    placeholder={t("objective.objectiveTitlePlaceholder")}
                  />
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <Button
                    variant="secondary"
                    onClick={handleClose}
                  >
                    {t("cancel")}
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleCreateCustomObjective}
                    disabled={!customObjective.objectiveTitle.trim()}
                  >
                    {editingData ? t("updateObjective") : t("modals.customObjective.createButton")}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
