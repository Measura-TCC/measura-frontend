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

    let submitData = { ...formData };

    if (componentType === "EQ") {
      if (formData.useSpecialCalculation) {
        // Special calculation: send all 6 fields (totals + breakdown)
        const inputFtr = Number(formData.inputFtr) || 0;
        const inputDet = Number(formData.inputDet) || 0;
        const outputFtr = Number(formData.outputFtr) || 0;
        const outputDet = Number(formData.outputDet) || 0;

        submitData = {
          ...formData,
          ftr: inputFtr + outputFtr,
          det: inputDet + outputDet,
          inputFtr,
          inputDet,
          outputFtr,
          outputDet,
        };
      } else {
        // Standard calculation: exclude special fields
        const { inputFtr, inputDet, outputFtr, outputDet, ...standardData } = formData;
        submitData = standardData;
      }
    }

    onSubmit(submitData);
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
          </>
        );

      case "EQ":
        return (
          <>
            <div className="mb-4 border border-gray-200 rounded-md p-4">
              <label className="flex items-center mb-2">
                <input
                  type="checkbox"
                  checked={formData.useSpecialCalculation || false}
                  onChange={(e) => {
                    handleChange("useSpecialCalculation", e.target.checked);
                    if (e.target.checked) {
                      handleChange("ftr", undefined);
                      handleChange("det", undefined);
                    } else {
                      handleChange("inputFtr", undefined);
                      handleChange("inputDet", undefined);
                      handleChange("outputFtr", undefined);
                      handleChange("outputDet", undefined);
                    }
                  }}
                  className="mr-2 h-4 w-4 text-indigo-600 rounded"
                />
                <span className="text-sm font-medium text-gray-700">
                  Usar cálculo especial (entrada e saída separadas)
                </span>
              </label>
              <p className="text-xs text-gray-500 ml-6">
                Recomendado quando entrada e saída têm complexidades diferentes
              </p>
            </div>

            {!formData.useSpecialCalculation ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    TR - Arquivos Referenciados *
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.ftr || ""}
                    onChange={(e) => handleChange("ftr", parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Total de arquivos/tabelas referenciados
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    TD - Elementos de Dados *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.det || ""}
                    onChange={(e) => handleChange("det", parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Total de campos/atributos
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <h4 className="font-medium text-gray-800 text-sm mb-3">
                    Parte de Entrada (Parâmetros e Filtros)
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        TR de Entrada *
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={formData.inputFtr || ""}
                        onChange={(e) => handleChange("inputFtr", parseInt(e.target.value))}
                        className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md"
                        required
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Arquivos para parâmetros
                      </p>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        TD de Entrada *
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={formData.inputDet || ""}
                        onChange={(e) => handleChange("inputDet", parseInt(e.target.value))}
                        className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md"
                        required
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Campos de entrada
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
                  <h4 className="font-medium text-gray-800 text-sm mb-3">
                    Parte de Saída (Resultados)
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        TR de Saída *
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={formData.outputFtr || ""}
                        onChange={(e) => handleChange("outputFtr", parseInt(e.target.value))}
                        className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md"
                        required
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Arquivos retornados
                      </p>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        TD de Saída *
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={formData.outputDet || ""}
                        onChange={(e) => handleChange("outputDet", parseInt(e.target.value))}
                        className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md"
                        required
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Campos retornados
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}

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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Lógica de Recuperação (opcional)
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Observações (opcional)
              </label>
              <textarea
                value={formData.notes || ""}
                onChange={(e) => handleChange("notes", e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
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
