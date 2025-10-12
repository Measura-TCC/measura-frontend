"use client";

import { useState, useEffect } from "react";
import type { ComponentType } from "@/core/types/fpa";

interface DynamicFPAFormProps {
  componentType: ComponentType;
  initialData?: Record<string, unknown>;
  onSubmit: (data: Record<string, unknown>) => void;
  onCancel: () => void;
}

export const DynamicFPAForm = ({
  componentType,
  initialData = {},
  onSubmit,
  onCancel,
}: DynamicFPAFormProps) => {
  const [formData, setFormData] = useState<Record<string, any>>(initialData);

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const renderFields = () => {
    switch (componentType) {
      case "ALI":
      case "AIE":
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipos de Registro (TR) *
              </label>
              <input
                type="number"
                min="1"
                value={formData.ret || ""}
                onChange={(e) => handleChange("ret", parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipos de Dados (TD) *
              </label>
              <input
                type="number"
                min="1"
                value={formData.det || ""}
                onChange={(e) => handleChange("det", parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Intenção Primária
              </label>
              <textarea
                value={formData.primaryIntent || ""}
                onChange={(e) => handleChange("primaryIntent", e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </>
        );

      case "EI":
      case "EO":
      case "EQ":
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Arquivos Referenciados (TR) *
              </label>
              <input
                type="number"
                min="0"
                value={formData.ftr || ""}
                onChange={(e) => handleChange("ftr", parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipos de Dados (TD) *
              </label>
              <input
                type="number"
                min="1"
                value={formData.det || ""}
                onChange={(e) => handleChange("det", parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Intenção Primária
              </label>
              <textarea
                value={formData.primaryIntent || ""}
                onChange={(e) => handleChange("primaryIntent", e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            {componentType === "EI" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lógica de Processamento
                </label>
                <textarea
                  value={formData.processingLogic || ""}
                  onChange={(e) =>
                    handleChange("processingLogic", e.target.value)
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            )}
            {componentType === "EO" && (
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.derivedData || false}
                  onChange={(e) =>
                    handleChange("derivedData", e.target.checked)
                  }
                  className="mr-2"
                />
                <label className="text-sm text-gray-700">
                  Contém dados derivados
                </label>
              </div>
            )}
            {componentType === "EQ" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lógica de Recuperação
                </label>
                <textarea
                  value={formData.retrievalLogic || ""}
                  onChange={(e) =>
                    handleChange("retrievalLogic", e.target.value)
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            )}
          </>
        );

      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-indigo-50 border border-indigo-200 rounded-md p-3 mb-4">
        <p className="text-sm text-indigo-800">
          <strong>Tipo de Componente:</strong> {componentType}
        </p>
      </div>

      {renderFields()}

      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
        >
          Salvar
        </button>
      </div>
    </form>
  );
};
