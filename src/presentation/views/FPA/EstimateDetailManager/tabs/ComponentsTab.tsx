"use client";

import { useTranslation } from "react-i18next";
import { ComponentList } from "@/presentation/views/FPA/common/ComponentList";
import { CreateALIForm } from "@/presentation/views/FPA/FPAWorkflow/components/CreateALIForm";
import { CreateEIForm } from "@/presentation/views/FPA/FPAWorkflow/components/CreateEIForm";
import { CreateEOForm } from "@/presentation/views/FPA/FPAWorkflow/components/CreateEOForm";
import { CreateEQForm } from "@/presentation/views/FPA/FPAWorkflow/components/CreateEQForm";
import { CreateAIEForm } from "@/presentation/views/FPA/FPAWorkflow/components/CreateAIEForm";
import type { ComponentResponse } from "@/core/hooks/fpa/components/useComponents";

type ComponentType = "ALI" | "EI" | "EO" | "EQ" | "AIE";

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

  if (!selectedComponentType) {
    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {[
            {
              type: "ALI" as ComponentType,
              label: t("components.addALIComponents"),
              desc: t("components.aliDescription"),
            },
            {
              type: "EI" as ComponentType,
              label: t("components.addEIComponents"),
              desc: t("components.eiDescription"),
            },
            {
              type: "EO" as ComponentType,
              label: t("components.addEOComponents"),
              desc: t("components.eoDescription"),
            },
            {
              type: "EQ" as ComponentType,
              label: t("components.addEQComponents"),
              desc: t("components.eqDescription"),
            },
            {
              type: "AIE" as ComponentType,
              label: t("components.addAIEComponents"),
              desc: t("components.aieDescription"),
            },
          ].map(({ type, label, desc }) => (
            <button
              key={type}
              onClick={() => setSelectedComponentType(type)}
              className="p-4 border border-border rounded-lg hover:border-primary/30 hover:shadow-sm transition-all text-left bg-background"
            >
              <h3 className="font-medium text-default mb-2">{label}</h3>
              <p className="text-sm text-secondary">{desc}</p>
            </button>
          ))}
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
        <button
          onClick={() => setSelectedComponentType(null)}
          className="px-4 py-2 text-primary border border-primary rounded-md hover:bg-primary/5 transition-colors"
        >
          ← {t("actions.backToComponentTypes")}
        </button>
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
