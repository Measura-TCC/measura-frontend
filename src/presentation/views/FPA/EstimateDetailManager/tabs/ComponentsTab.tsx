"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useToast } from "@/core/hooks/common/useToast";
import { ComponentList } from "@/presentation/views/FPA/common/ComponentList";
import { RequirementImportView } from "@/presentation/views/FPA/FPAWorkflow/RequirementImport/RequirementImportView";
import { CreateALIForm } from "@/presentation/views/FPA/FPAWorkflow/components/CreateALIForm";
import { CreateEIForm } from "@/presentation/views/FPA/FPAWorkflow/components/CreateEIForm";
import { CreateEOForm } from "@/presentation/views/FPA/FPAWorkflow/components/CreateEOForm";
import { CreateEQForm } from "@/presentation/views/FPA/FPAWorkflow/components/CreateEQForm";
import { CreateAIEForm } from "@/presentation/views/FPA/FPAWorkflow/components/CreateAIEForm";
import { PlusIcon } from "@/presentation/assets/icons";
import { Button } from "@/presentation/components/primitives";
import type { ComponentResponse } from "@/core/hooks/fpa/components/useComponents";

type ComponentType = "ALI" | "EI" | "EO" | "EQ" | "AIE";
type ViewMode = "list" | "import" | "edit";

interface ComponentItem {
  _id: string;
  name: string;
  description?: string;
  complexity?: "LOW" | "MEDIUM" | "HIGH";
  functionPoints?: number;
  primaryIntent?: string;
  recordElementTypes?: number;
  dataElementTypes?: number;
  fileTypesReferenced?: number;
  derivedData?: boolean;
  outputFormat?: string;
  retrievalLogic?: string;
  externalSystem?: string;
  createdAt: string;
  updatedAt: string;
}

interface ComponentsTabProps {
  estimateId: string;
  selectedComponentType: ComponentType | null;
  setSelectedComponentType: (type: ComponentType | null) => void;
  aliComponents: ComponentResponse[];
  aieComponents: ComponentResponse[];
  eiComponents: ComponentResponse[];
  eoComponents: ComponentResponse[];
  eqComponents: ComponentResponse[];
  isLoadingALI: boolean;
  isLoadingAIE: boolean;
  isLoadingEI: boolean;
  isLoadingEO: boolean;
  isLoadingEQ: boolean;
  onDeleteComponent: (
    componentId: string,
    componentType: ComponentType
  ) => Promise<void>;
  onComponentAdded: () => void;
}

export const ComponentsTab = ({
  estimateId,
  selectedComponentType,
  setSelectedComponentType,
  aliComponents,
  aieComponents,
  eiComponents,
  eoComponents,
  eqComponents,
  isLoadingALI,
  isLoadingAIE,
  isLoadingEI,
  isLoadingEO,
  isLoadingEQ,
  onDeleteComponent,
  onComponentAdded,
}: ComponentsTabProps) => {
  const { t } = useTranslation("fpa");
  const toast = useToast();
  const [editingComponent, setEditingComponent] = useState<{
    component: ComponentItem;
    type: ComponentType;
  } | null>(null);

  const handleEdit = (component: ComponentItem, type: ComponentType) => {
    setEditingComponent({ component, type });
    setViewMode("edit");
  };

  const handleEditSuccess = () => {
    const componentTypeName = {
      ALI: t("components.aliTitle"),
      AIE: t("components.aieTitle"),
      EI: t("components.eiTitle"),
      EO: t("components.eoTitle"),
      EQ: t("components.eqTitle"),
    }[editingComponent?.type || "ALI"];

    toast.success({
      message: t("components.editSuccess", {
        type: componentTypeName,
        name: editingComponent?.component.name,
      }),
    });
    setEditingComponent(null);
    setViewMode("list");
    onComponentAdded(); // Refresh data
  };

  const handleCancelEdit = () => {
    setEditingComponent(null);
    setViewMode("list");
  };

  const handleImportComplete = () => {
    setViewMode("list");
    onComponentAdded(); // Refresh data
  };

  // Import View - Reuse requirement import flow
  if (viewMode === "import") {
    return (
      <div>
        <div className="mb-4">
          <Button
            onClick={() => setViewMode("list")}
            variant="secondary"
            size="md"
          >
            ← {t("actions.back")}
          </Button>
        </div>
        <RequirementImportView onProceed={handleImportComplete} />
      </div>
    );
  }

  // Edit View - Show edit form
  if (viewMode === "edit" && editingComponent) {
    return (
      <div>
        <div className="mb-4">
          <Button
            onClick={handleCancelEdit}
            variant="secondary"
            size="md"
          >
            ← {t("actions.cancel")}
          </Button>
        </div>
        <div className="bg-background-secondary p-6 rounded-lg mb-4">
          <h3 className="text-lg font-semibold mb-2 text-default">
            {t("components.editingComponent")}: {editingComponent.component.name}
          </h3>
          <p className="text-sm text-secondary">
            {t("components.editDescription")}
          </p>
        </div>
        {editingComponent.type === "ALI" && (
          <CreateALIForm
            estimateId={estimateId}
            onSuccess={handleEditSuccess}
            componentToEdit={editingComponent.component}
          />
        )}
        {editingComponent.type === "EI" && (
          <CreateEIForm
            estimateId={estimateId}
            onSuccess={handleEditSuccess}
            componentToEdit={editingComponent.component}
          />
        )}
        {editingComponent.type === "EO" && (
          <CreateEOForm
            estimateId={estimateId}
            onSuccess={handleEditSuccess}
            componentToEdit={editingComponent.component}
          />
        )}
        {editingComponent.type === "EQ" && (
          <CreateEQForm
            estimateId={estimateId}
            onSuccess={handleEditSuccess}
            componentToEdit={editingComponent.component}
          />
        )}
        {editingComponent.type === "AIE" && (
          <CreateAIEForm
            estimateId={estimateId}
            onSuccess={handleEditSuccess}
            componentToEdit={editingComponent.component}
          />
        )}
      </div>
    );
  }

  // List View - Show components and import button
  if (viewMode === "list") {
    return (
      <>
        <div className="mb-6 flex justify-end">
          <Button
            onClick={() => setViewMode("import")}
            variant="primary"
            size="md"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            {t("components.addComponents")}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-default">
              {t("components.aliTitle")}
            </h3>
            <ComponentList
              title=""
              components={aliComponents || []}
              isLoading={isLoadingALI}
              componentType="ALI"
              onEdit={(component) => handleEdit(component, "ALI")}
              onDelete={(id) => onDeleteComponent(id, "ALI")}
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-default">
              {t("components.aieTitle")}
            </h3>
            <ComponentList
              title=""
              components={aieComponents || []}
              isLoading={isLoadingAIE}
              componentType="AIE"
              onEdit={(component) => handleEdit(component, "AIE")}
              onDelete={(id) => onDeleteComponent(id, "AIE")}
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-default">
              {t("components.eiTitle")}
            </h3>
            <ComponentList
              title=""
              components={eiComponents || []}
              isLoading={isLoadingEI}
              componentType="EI"
              onEdit={(component) => handleEdit(component, "EI")}
              onDelete={(id) => onDeleteComponent(id, "EI")}
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-default">
              {t("components.eoTitle")}
            </h3>
            <ComponentList
              title=""
              components={eoComponents || []}
              isLoading={isLoadingEO}
              componentType="EO"
              onEdit={(component) => handleEdit(component, "EO")}
              onDelete={(id) => onDeleteComponent(id, "EO")}
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-default">
              {t("components.eqTitle")}
            </h3>
            <ComponentList
              title=""
              components={eqComponents || []}
              isLoading={isLoadingEQ}
              componentType="EQ"
              onEdit={(component) => handleEdit(component, "EQ")}
              onDelete={(id) => onDeleteComponent(id, "EQ")}
            />
          </div>
        </div>
      </>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <Button
          onClick={() => setSelectedComponentType(null)}
          variant="secondary"
          size="md"
        >
          ← {t("actions.backToComponentTypes")}
        </Button>
      </div>
      {selectedComponentType === "ALI" && (
        <CreateALIForm estimateId={estimateId} onSuccess={onComponentAdded} />
      )}
      {selectedComponentType === "EI" && (
        <CreateEIForm estimateId={estimateId} onSuccess={onComponentAdded} />
      )}
      {selectedComponentType === "EO" && (
        <CreateEOForm estimateId={estimateId} onSuccess={onComponentAdded} />
      )}
      {selectedComponentType === "EQ" && (
        <CreateEQForm estimateId={estimateId} onSuccess={onComponentAdded} />
      )}
      {selectedComponentType === "AIE" && (
        <CreateAIEForm estimateId={estimateId} onSuccess={onComponentAdded} />
      )}
    </div>
  );
};
