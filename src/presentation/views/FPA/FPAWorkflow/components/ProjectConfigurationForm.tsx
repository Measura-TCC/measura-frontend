"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { Button } from "@/presentation/components/primitives";

const projectConfigSchemaFactory = (t: (key: string) => string) =>
  z.object({
    teamSize: z
      .number()
      .min(1, t("fpa.teamSize.min"))
      .max(100, t("fpa.teamSize.max")),
    hourlyRateBRL: z.number().min(0.01, t("fpa.hourlyRate.min")),
    productivityFactor: z
      .number()
      .min(1, t("fpa.productivityFactor.min"))
      .max(100, t("fpa.productivityFactor.max")),
    averageDailyWorkingHours: z
      .number()
      .min(1, t("fpa.workingHours.min"))
      .max(24, t("fpa.workingHours.max")),
  });

interface ProjectConfigData {
  teamSize: number;
  hourlyRateBRL: number;
  productivityFactor: number;
  averageDailyWorkingHours: number;
}

interface ProjectConfigurationFormProps {
  initialData?: Partial<ProjectConfigData>;
  onSuccess: (data: ProjectConfigData) => void;
  onBack: () => void;
}

export const ProjectConfigurationForm = ({
  initialData,
  onSuccess,
  onBack,
}: ProjectConfigurationFormProps) => {
  const { t } = useTranslation("validation");
  const { t: tFpa } = useTranslation("fpa");

  const schema = projectConfigSchemaFactory(t);
  type FormData = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      teamSize: initialData?.teamSize || 1,
      hourlyRateBRL: initialData?.hourlyRateBRL || 150,
      productivityFactor: initialData?.productivityFactor || 10,
      averageDailyWorkingHours: initialData?.averageDailyWorkingHours || 8,
    },
  });

  const onSubmit = (data: FormData) => {
    onSuccess(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="teamSize"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {tFpa("estimateForm.teamSize")}
          </label>
          <input
            {...register("teamSize", { valueAsNumber: true })}
            type="number"
            min="1"
            max="100"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {errors.teamSize && (
            <p className="mt-1 text-sm text-red-600">
              {errors.teamSize.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="hourlyRateBRL"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {tFpa("estimateForm.hourlyRate")}
          </label>
          <input
            {...register("hourlyRateBRL", { valueAsNumber: true })}
            type="number"
            min="0.01"
            step="0.01"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {errors.hourlyRateBRL && (
            <p className="mt-1 text-sm text-red-600">
              {errors.hourlyRateBRL.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="productivityFactor"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {tFpa("estimateForm.productivityFactor")}
          </label>
          <input
            {...register("productivityFactor", { valueAsNumber: true })}
            type="number"
            min="1"
            max="100"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {errors.productivityFactor && (
            <p className="mt-1 text-sm text-red-600">
              {errors.productivityFactor.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="averageDailyWorkingHours"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {tFpa("estimateForm.dailyWorkingHours")}
          </label>
          <input
            {...register("averageDailyWorkingHours", { valueAsNumber: true })}
            type="number"
            min="1"
            max="24"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {errors.averageDailyWorkingHours && (
            <p className="mt-1 text-sm text-red-600">
              {errors.averageDailyWorkingHours.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button type="button" onClick={onBack} variant="secondary" size="md">
          Voltar
        </Button>
        <Button type="submit" variant="primary" size="md">
          Próximo
        </Button>
      </div>
    </form>
  );
};
