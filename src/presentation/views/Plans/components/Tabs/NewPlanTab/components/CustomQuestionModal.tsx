import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Button,
  Input,
  Tabs,
} from "@/presentation/components/primitives";
import type { Question } from "../utils/types";
import { availableQuestions } from "../utils/stepData";

interface CustomQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddQuestion: (question: Question) => void;
  editingData?: Question;
}

export const CustomQuestionModal: React.FC<CustomQuestionModalProps> = ({
  isOpen,
  onClose,
  onAddQuestion,
  editingData,
}) => {
  const { t } = useTranslation("plans");
  const [selectedTab, setSelectedTab] = useState(editingData ? "custom" : "predefined");

  // If editing data contains a translation key, translate it for display
  const getInitialQuestionText = () => {
    if (!editingData?.questionText) return "";
    // Check if it's a translation key (starts with "questions.")
    if (editingData.questionText.startsWith("questions.")) {
      return t(editingData.questionText);
    }
    return editingData.questionText;
  };

  const [customQuestion, setCustomQuestion] = useState<Omit<Question, "metrics">>({
    questionText: getInitialQuestionText(),
  });

  // Update state when editingData changes
  useEffect(() => {
    if (editingData) {
      setCustomQuestion({
        questionText: getInitialQuestionText(),
      });
    }
  }, [editingData]);

  const handleAddPredefinedQuestion = (question: Question) => {
    onAddQuestion(question);
    onClose();
  };

  const handleCreateCustomQuestion = () => {
    const trimmedText = customQuestion.questionText.trim();
    if (!trimmedText) return;

    const newQuestion: Question = {
      questionText: trimmedText,
      metrics: [], // Start with empty metrics array
    };

    onAddQuestion(newQuestion);
    onClose();

    // Reset form
    setCustomQuestion({
      questionText: "",
    });
  };

  const handleClose = () => {
    setSelectedTab("predefined");
    setCustomQuestion({
      questionText: "",
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-white/20 flex items-center justify-center z-50" onClick={handleClose}>
      <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto shadow-xl border" onClick={(e) => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">
              {editingData ? t("editQuestion") : t("modals.customQuestion.title")}
            </h2>
            <button onClick={handleClose} className="text-gray-500 hover:text-gray-700 cursor-pointer">
              ×
            </button>
          </div>

          {!editingData && (
            <div className="mb-4">
              <Tabs
                tabs={[
                  { id: "predefined", label: t("modals.customQuestion.predefinedTab") },
                  { id: "custom", label: t("modals.customQuestion.customTab") },
                ]}
                activeTab={selectedTab}
                onTabChange={setSelectedTab}
              />
            </div>
          )}

          {!editingData && selectedTab === 'predefined' && (
            <div className="space-y-4">
              <p className="text-secondary text-sm mb-4">
                {t("modals.customQuestion.predefinedDescription")}
              </p>
              <div className="max-h-64 overflow-y-auto space-y-2">
                {availableQuestions.map((question) => (
                  <div
                    key={question.questionText}
                    className="border border-border rounded-lg p-3 hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleAddPredefinedQuestion(question)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-default text-sm">
                          {t(question.questionText)}
                        </h4>
                      </div>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddPredefinedQuestion(question);
                        }}
                      >
                        {t("modals.customQuestion.addButton")}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(editingData || selectedTab === 'custom') && (
            <div className="space-y-4">
              <p className="text-secondary text-sm mb-4">
                {t("modals.customQuestion.customDescription")}
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-default mb-1">
                    {t("question.questionText")} *
                  </label>
                  <Input
                    value={customQuestion.questionText}
                    onChange={(e) => setCustomQuestion(prev => ({ ...prev, questionText: e.target.value }))}
                    placeholder={t("question.questionTextPlaceholder")}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="secondary" onClick={handleClose}>
                  {t("modals.customQuestion.cancelButton")}
                </Button>
                <Button
                  variant="primary"
                  onClick={handleCreateCustomQuestion}
                  disabled={!customQuestion.questionText.trim()}
                >
                  {editingData ? t("updateQuestion") : t("modals.customQuestion.createButton")}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};