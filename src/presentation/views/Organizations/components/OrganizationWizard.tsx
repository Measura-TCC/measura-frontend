"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm, type Path } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import {
  createOrganizationSchema,
  type CreateOrganizationData,
} from "@/core/schemas/organizations";
import { useOrganizationActions } from "@/core/hooks/organizations/useOrganizations";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Input,
} from "@/presentation/components/primitives";

export interface OrganizationWizardProps {
  mode: "create" | "edit";
  initialData?: Partial<CreateOrganizationData> & { id?: string };
  onCancel: () => void;
  onSuccess?: () => void;
  hideFooter?: boolean;
  onControls?: (controls: {
    next: () => void;
    prev: () => void;
    submit: () => void;
    isFirstStep: boolean;
    isLastStep: boolean;
    currentStep: number;
    totalSteps: number;
    isSubmitting: boolean;
    canGoNext: boolean;
    canSubmit: boolean;
  }) => void;
}

type Step = 1 | 2 | 3 | 4;

export const OrganizationWizard: React.FC<OrganizationWizardProps> = ({
  mode,
  initialData,
  onCancel,
  onSuccess,
  hideFooter,
  onControls,
}) => {
  const { t } = useTranslation("organization");
  const { createOrganization, updateOrganization, deleteOrganization } =
    useOrganizationActions();

  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CreateOrganizationData>({
    resolver: zodResolver(createOrganizationSchema),
    defaultValues: useMemo(
      () => ({
        name: initialData?.name || "",
        description: initialData?.description || "",
        website: initialData?.website || "",
        industry: initialData?.industry || "",
        mission: initialData?.mission || "",
        vision: initialData?.vision || "",
        values: initialData?.values || "",
        strategicObjectives: initialData?.strategicObjectives || "",
      }),
      [initialData]
    ),
  });

  // utility
  const next = async () => {
    let fields: Path<CreateOrganizationData>[] = [];
    if (currentStep === 1) fields = ["name", "description", "website", "industry"];
    if (currentStep === 2) fields = ["mission", "vision", "values"];
    if (currentStep === 3) fields = ["strategicObjectives"];

    // Sync hidden fields that depend on chips
    setValue("values", valuesList.join(", "));
    setValue("strategicObjectives", objectivesList.join("\n"));

    // Validate current step
    const valid = await form.trigger(fields, { shouldFocus: true });
    if (!valid) return;
    setCurrentStep((s) => (Math.min(4, (s as number) + 1) as Step));
  };
  const prev = () => setCurrentStep((s) => (Math.max(1, (s as number) - 1) as Step));

  const onSubmit = async (data: CreateOrganizationData) => {
    setIsSubmitting(true);
    try {
      if (mode === "create") {
        await createOrganization(data);
      } else if (mode === "edit" && initialData?.id) {
        await updateOrganization({ id: initialData.id, data });
      }
      onSuccess?.();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!initialData?.id) return;
    const ok = window.confirm(t("confirmDelete"));
    if (!ok) return;
    setIsSubmitting(true);
    try {
      await deleteOrganization({ id: initialData.id });
      onSuccess?.();
      onCancel();
    } finally {
      setIsSubmitting(false);
    }
  };

  const { register, handleSubmit, formState, setValue, watch, getValues } = form;
  const { errors } = formState;

  // Suggestions similar to Plans flow
  const recommendedValues = (t("suggestions.values") as string)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const recommendedObjectives = (t("suggestions.objectives") as string)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  // Local lists for chips
  const [valuesList, setValuesList] = useState<string[]>(() => {
    const base = initialData?.values;
    return base ? base.split(/,|\n/).map((s) => s.trim()).filter(Boolean) : [];
  });
  const [objectivesList, setObjectivesList] = useState<string[]>(() => {
    const base = initialData?.strategicObjectives;
    return base ? base.split(/\n|,/).map((s) => s.trim()).filter(Boolean) : [];
  });

  const addValueItem = (item: string) => {
    const v = item.trim();
    if (!v || valuesList.includes(v)) return;
    const next = [...valuesList, v];
    setValuesList(next);
    setValue("values", next.join(", "));
  };
  const removeValueItem = (item: string) => {
    const next = valuesList.filter((i) => i !== item);
    setValuesList(next);
    setValue("values", next.join(", "));
  };
  const addObjectiveItem = (item: string) => {
    const v = item.trim();
    if (!v || objectivesList.includes(v)) return;
    const next = [...objectivesList, v];
    setObjectivesList(next);
    setValue("strategicObjectives", next.join("\n"));
  };
  const removeObjectiveItem = (item: string) => {
    const next = objectivesList.filter((i) => i !== item);
    setObjectivesList(next);
    setValue("strategicObjectives", next.join("\n"));
  };

  const stepItems = [
    { number: 1, name: t("steps.basics") },
    { number: 2, name: t("steps.identity") },
    { number: 3, name: t("steps.strategy") },
    { number: 4, name: t("steps.review") },
  ];

  const submit = handleSubmit(onSubmit);

  // recompute validity on any change
  watch();

  const nonEmpty = (v?: string) => !!v && v.trim().length > 0;
  const step1Valid =
    nonEmpty(getValues("name")) &&
    nonEmpty(getValues("description")) &&
    nonEmpty(getValues("website")) &&
    nonEmpty(getValues("industry"));
  const step2Valid =
    nonEmpty(getValues("mission")) &&
    nonEmpty(getValues("vision")) &&
    valuesList.length > 0;
  const step3Valid = objectivesList.length > 0;
  const canGoNext =
    (currentStep === 1 && step1Valid) ||
    (currentStep === 2 && step2Valid) ||
    (currentStep === 3 && step3Valid);
  const allValid = step1Valid && step2Valid && step3Valid;

  // expose controls to parent when requested
  useEffect(() => {
    onControls?.({
      next,
      prev,
      submit,
      isFirstStep: currentStep === 1,
      isLastStep: currentStep === stepItems.length,
      currentStep,
      totalSteps: stepItems.length,
      isSubmitting,
      canGoNext,
      canSubmit: allValid,
    });
  }, [currentStep, isSubmitting, canGoNext, allValid, next, prev, submit, onControls, stepItems.length]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        {stepItems.map((step, index) => (
          <div key={step.number} className="flex flex-col items-center flex-1">
            <button
              type="button"
              onClick={() => setCurrentStep(step.number as Step)}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                currentStep === step.number
                  ? "bg-primary text-white"
                  : "bg-primary/20 text-primary hover:bg-primary/30"
              }`}
            >
              {step.number}
            </button>
            <div className="text-xs text-center mt-1 max-w-24">{step.name}</div>
            {index < stepItems.length - 1 && (
              <div className="flex-1 h-px bg-gray-200 mt-4 mx-2" />
            )}
          </div>
        ))}
      </div>

      <div>
        <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
          ← {t("backToDetails")}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {currentStep === 1 && t("steps.basics")}
            {currentStep === 2 && t("steps.identity")}
            {currentStep === 3 && t("steps.strategy")}
            {currentStep === 4 && t("steps.review")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentStep === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-default">
                  {t("form.organizationNameLabel")}
                </label>
                <Input
                  {...register("name")}
                  placeholder={t("form.organizationNamePlaceholder")}
                />
                {errors.name && (
                  <p className="text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-default">
                  {t("form.descriptionLabel")}
                </label>
                <textarea
                  {...register("description")}
                  rows={3}
                  placeholder={t("form.descriptionPlaceholder")}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                {errors.description && (
                  <p className="text-sm text-red-600">{errors.description.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-default">
                  {t("form.websiteLabel")}
                </label>
                <Input
                  {...register("website")}
                  placeholder={t("form.websitePlaceholder")}
                />
                {errors.website && (
                  <p className="text-sm text-red-600">{errors.website.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-default">
                  {t("form.industryLabel")}
                </label>
                <Input
                  {...register("industry")}
                  placeholder={t("form.industryPlaceholder")}
                />
                {errors.industry && (
                  <p className="text-sm text-red-600">{errors.industry.message}</p>
                )}
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-default">
                  {t("form.missionLabel")}
                </label>
                <textarea
                  {...register("mission")}
                  rows={3}
                  placeholder={t("form.missionPlaceholder")}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                {errors.mission && (
                  <p className="text-sm text-red-600">{String(errors.mission.message)}</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-default">
                  {t("form.visionLabel")}
                </label>
                <textarea
                  {...register("vision")}
                  rows={3}
                  placeholder={t("form.visionPlaceholder")}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                {errors.vision && (
                  <p className="text-sm text-red-600">{String(errors.vision.message)}</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-default">
                  {t("form.valuesLabel")}
                </label>
                <div className="relative">
                  <select
                    className="input-base appearance-none pr-8 bg-white"
                    value=""
                    onChange={(e) => {
                      if (e.target.value) {
                        addValueItem(e.target.value);
                        e.target.value = "";
                      }
                    }}
                  >
                    <option value="">{t("form.selectValuePlaceholder")}</option>
                    {recommendedValues
                      .filter((v) => !valuesList.includes(v))
                      .map((v) => (
                        <option key={v} value={v}>
                          {v}
                        </option>
                      ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                  </div>
                </div>
                <div className="flex gap-2 mt-2">
                  <div className="flex-1">
                    <Input
                      placeholder={t("form.addValuePlaceholder")}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          const target = e.target as HTMLInputElement;
                          addValueItem(target.value);
                          target.value = "";
                        }
                      }}
                    />
                  </div>
                  <Button
                    type="button"
                    onClick={() => {
                      const input = document.activeElement as HTMLInputElement;
                      if (input && input.tagName === "INPUT") {
                        addValueItem(input.value);
                        input.value = "";
                      }
                    }}
                    className="h-[2.25rem]"
                  >
                    {t("add")}
                  </Button>
                </div>
                {valuesList.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {valuesList.map((v) => (
                      <span
                        key={v}
                        className="inline-flex items-center bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
                      >
                        {v}
                        <button
                          className="ml-2"
                          type="button"
                          onClick={() => removeValueItem(v)}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                <input type="hidden" {...register("values")} />
                {errors.values && (
                  <p className="text-sm text-red-600">{String(errors.values.message)}</p>
                )}
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-default">
                {t("form.strategicObjectivesLabel")}
              </label>
              {/* Suggested objectives dropdown */}
              <div className="relative mb-2">
                <select
                  className="input-base appearance-none pr-8 bg-white"
                  value=""
                  onChange={(e) => {
                    if (e.target.value) {
                      addObjectiveItem(e.target.value);
                      e.target.value = "";
                    }
                  }}
                >
                  <option value="">{t("form.selectObjectivePlaceholder")}</option>
                  {recommendedObjectives
                    .filter((o) => !objectivesList.includes(o))
                    .map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <Input
                    placeholder={t("form.addObjectivePlaceholder")}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        const target = e.target as HTMLInputElement;
                        addObjectiveItem(target.value);
                        target.value = "";
                      }
                    }}
                  />
                </div>
                <Button
                  type="button"
                  onClick={() => {
                    const input = document.activeElement as HTMLInputElement;
                    if (input && input.tagName === "INPUT") {
                      addObjectiveItem(input.value);
                      input.value = "";
                    }
                  }}
                  className="h-[2.25rem]"
                >
                  {t("add")}
                </Button>
              </div>
              {objectivesList.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {objectivesList.map((o, idx) => (
                    <span
                      key={`${o}-${idx}`}
                      className="inline-flex items-center bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
                    >
                      {o}
                      <button
                        className="ml-2"
                        type="button"
                        onClick={() => removeObjectiveItem(o)}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
              <input type="hidden" {...register("strategicObjectives")} />
              {errors.strategicObjectives && (
                <p className="text-sm text-red-600">{String(errors.strategicObjectives.message)}</p>
              )}
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-3">
              <p className="text-secondary">{t("reviewInstructions")}</p>
              <div>
                <strong>{t("name")}:</strong> {form.getValues("name")}
              </div>
              {form.getValues("description") && (
                <div>
                  <strong>{t("description")}:</strong> {form.getValues("description")}
                </div>
              )}
              {form.getValues("website") && (
                <div>
                  <strong>{t("website")}:</strong> {form.getValues("website")}
                </div>
              )}
              {form.getValues("industry") && (
                <div>
                  <strong>{t("industry")}:</strong> {form.getValues("industry")}
                </div>
              )}
              {form.getValues("mission") && (
                <div>
                  <strong>{t("mission")}:</strong> {form.getValues("mission")}
                </div>
              )}
              {form.getValues("vision") && (
                <div>
                  <strong>{t("vision")}:</strong> {form.getValues("vision")}
                </div>
              )}
              {form.getValues("values") && (
                <div>
                  <strong>{t("values")}:</strong> {form.getValues("values")}
                </div>
              )}
              {form.getValues("strategicObjectives") && (
                <div>
                  <strong>{t("strategicObjectives")}:</strong> {form.getValues("strategicObjectives")}
                </div>
              )}
            </div>
          )}

          {!hideFooter && (
            <div className="flex items-center justify-between pt-2">
              <div className="flex gap-2">
                <Button type="button" variant="ghost" onClick={onCancel}>
                  {t("cancel")}
                </Button>
                {mode === "edit" && initialData?.id && (
                  <Button type="button" variant="danger" onClick={handleDelete} disabled={isSubmitting}>
                    {t("delete")}
                  </Button>
                )}
              </div>
              <div className="flex gap-2">
                <Button type="button" variant="secondary" onClick={prev} disabled={currentStep === 1}>
                  {t("previous")}
                </Button>
                {currentStep < 4 ? (
                  <Button type="button" variant="primary" onClick={next} disabled={!canGoNext}>
                    {t("next")}
                  </Button>
                ) : (
                  <Button type="button" variant="primary" disabled={isSubmitting || !allValid} onClick={submit}>
                    {mode === "create" ? t("createOrganization") : t("save")}
                  </Button>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
