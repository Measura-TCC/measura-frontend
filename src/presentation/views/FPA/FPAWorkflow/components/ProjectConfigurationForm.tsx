"use client";

import { forwardRef, useImperativeHandle } from "react";
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

export interface ProjectConfigurationFormRef {
  validateAndSave: () => Promise<boolean>;
}

export const ProjectConfigurationForm = forwardRef<ProjectConfigurationFormRef, ProjectConfigurationFormProps>(({
  initialData,
  onSuccess,
  onBack,
}, ref) => {
  const { t } = useTranslation("validation");
  const { t: tFpa } = useTranslation("fpa");

  const schema = projectConfigSchemaFactory(t);
  type FormData = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    trigger,
    getValues,
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

  useImperativeHandle(ref, () => ({
    async validateAndSave() {
      const isValid = await trigger();
      if (isValid) {
        const data = getValues();
        onSuccess(data);
        return true;
      }
      return false;
    },
  }));

  const onSubmit = (data: FormData) => {
    onSuccess(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="teamSize"
            className="block text-sm font-medium text-secondary mb-1"
          >
            {tFpa("estimateForm.teamSize")}
          </label>
          <input
            {...register("teamSize", { valueAsNumber: true })}
            type="number"
            min="1"
            max="100"
            className="w-full px-3 py-2 border border-border bg-background text-default rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
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
            className="block text-sm font-medium text-secondary mb-1"
          >
            {tFpa("estimateForm.hourlyRate")}
          </label>
          <input
            {...register("hourlyRateBRL", { valueAsNumber: true })}
            type="number"
            min="0.01"
            step="0.01"
            className="w-full px-3 py-2 border border-border bg-background text-default rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
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
            className="block text-sm font-medium text-secondary mb-1"
          >
            {tFpa("estimateForm.productivityFactor")}
          </label>
          <input
            {...register("productivityFactor", { valueAsNumber: true })}
            type="number"
            min="1"
            max="100"
            className="w-full px-3 py-2 border border-border bg-background text-default rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
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
            className="block text-sm font-medium text-secondary mb-1"
          >
            {tFpa("estimateForm.dailyWorkingHours")}
          </label>
          <input
            {...register("averageDailyWorkingHours", { valueAsNumber: true })}
            type="number"
            min="1"
            max="24"
            className="w-full px-3 py-2 border border-border bg-background text-default rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
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
});

ProjectConfigurationForm.displayName = "ProjectConfigurationForm";
