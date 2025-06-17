import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import useSWR, { mutate } from "swr";
import { useUserOrganization } from "@/core/hooks/organizations/useOrganizations";
import {
  Plan,
  PlanFormData,
  UpdatePlanRequest,
  PlansStatistics,
  PlanStatus,
  PlanType,
  PlanTemplate,
  GQMData,
  GQMPhase,
} from "@/core/types/plans";

const createPlanSchema = z.object({
  name: z.string().min(1, "Plan name is required"),
  description: z.string().min(1, "Description is required"),
  type: z.enum(["measurement", "estimation", "quality", "performance"]),
  owner: z.string().min(1, "Owner is required"),
});

export type UsePlansReturn = {
  plans: Plan[] | undefined;
  templates: PlanTemplate[];
  statistics: PlansStatistics;
  gqmData: GQMData;

  isLoadingPlans: boolean;
  isCreatingPlan: boolean;
  isUpdatingPlan: boolean;

  plansError: Error | null;

  canCreatePlan: boolean;
  canEditPlan: boolean;
  hasOrganization: boolean;

  planForm: ReturnType<typeof useForm<PlanFormData>>;
  formErrors: Record<string, { message?: string }>;

  createPlan: (data: PlanFormData) => Promise<void>;
  updatePlan: (data: UpdatePlanRequest) => Promise<void>;
  deletePlan: (id: string) => Promise<void>;
  duplicatePlan: (id: string) => Promise<void>;
  applyTemplate: (template: PlanTemplate) => void;

  updateGQMPhase: (planId: string, phase: GQMPhase) => Promise<void>;
  getGQMDataForPlan: (planId: string) => GQMData;

  formatDate: (date: Date | string) => string;
  getStatusColor: (status: PlanStatus) => string;
  getTypeLabel: (type: PlanType) => string;
  refreshData: () => Promise<void>;
  resetForm: () => void;
};

export const usePlans = (): UsePlansReturn => {
  const { t } = useTranslation("plans");
  const router = useRouter();
  const { userOrganization, isLoadingUserOrganization } = useUserOrganization();

  const [isCreatingPlan, setIsCreatingPlan] = useState(false);
  const [isUpdatingPlan, setIsUpdatingPlan] = useState(false);

  const planForm = useForm<PlanFormData>({
    resolver: zodResolver(createPlanSchema),
    defaultValues: {
      name: "",
      description: "",
      type: "measurement",
      owner: "",
    },
  });

  const {
    formState: { errors: formErrors },
  } = planForm;

  const {
    data: plans,
    error: plansError,
    isLoading: isLoadingPlans,
  } = useSWR(
    userOrganization ? "/api/plans" : null,
    async () => {
      const mockPlans: Plan[] = [
        {
          id: "1",
          name: "Q1 2024 Measurement Plan",
          description:
            "Comprehensive measurement plan for first quarter initiatives",
          type: "measurement",
          startDate: new Date("2024-01-01"),
          endDate: new Date("2024-03-31"),
          status: "active",
          owner: "Sarah Johnson",
          progress: 65,
          goalsCount: 8,
          metricsCount: 15,
          gqmPhase: "data_collection",
        },
        {
          id: "2",
          name: "Software Quality Assessment",
          description:
            "Quality metrics and improvement tracking for core products",
          type: "quality",
          startDate: new Date("2024-01-15"),
          endDate: new Date("2024-06-30"),
          status: "active",
          owner: "Mike Chen",
          progress: 30,
          goalsCount: 5,
          metricsCount: 12,
          gqmPhase: "definition",
        },
        {
          id: "3",
          name: "Performance Optimization Initiative",
          description: "System performance measurement and optimization goals",
          type: "performance",
          startDate: new Date("2024-02-01"),
          endDate: new Date("2024-05-31"),
          status: "scheduled",
          owner: "Alex Rodriguez",
          progress: 0,
          goalsCount: 4,
          metricsCount: 8,
          gqmPhase: "planning",
        },
        {
          id: "4",
          name: "Development Team Productivity",
          description: "Track and improve development team efficiency metrics",
          type: "measurement",
          startDate: new Date("2023-10-01"),
          endDate: new Date("2023-12-31"),
          status: "completed",
          owner: "Emily Davis",
          progress: 100,
          goalsCount: 6,
          metricsCount: 10,
          gqmPhase: "completed",
        },
      ];
      return mockPlans;
    },
    {
      revalidateOnFocus: false,
    }
  );

  const templates: PlanTemplate[] = [
    {
      id: "quality",
      name: "Quality Assurance Plan",
      description: "Comprehensive quality measurement and improvement plan",
      type: "quality",
      estimatedDuration: 180,
      goalsCount: 5,
      metricsCount: 12,
    },
    {
      id: "productivity",
      name: "Productivity Analysis Plan",
      description: "Team productivity measurement and optimization plan",
      type: "measurement",
      estimatedDuration: 120,
      goalsCount: 4,
      metricsCount: 8,
    },
    {
      id: "performance",
      name: "Project Performance Plan",
      description: "Project delivery and performance tracking plan",
      type: "performance",
      estimatedDuration: 90,
      goalsCount: 3,
      metricsCount: 6,
    },
  ];

  const gqmData: GQMData = {
    goals: [],
    questions: [],
    metrics: [],
  };

  const canCreatePlan = Boolean(userOrganization && !isLoadingUserOrganization);
  const canEditPlan = Boolean(userOrganization);
  const hasOrganization = Boolean(userOrganization);

  const statistics: PlansStatistics = {
    totalPlans: plans?.length || 0,
    activePlans: plans?.filter((p) => p.status === "active").length || 0,
    completedPlans: plans?.filter((p) => p.status === "completed").length || 0,
    draftPlans: plans?.filter((p) => p.status === "draft").length || 0,
    averageProgress: plans?.length
      ? Math.round(
          (plans.reduce((sum, p) => sum + p.progress, 0) || 0) / plans.length
        )
      : 0,
    totalGoals: plans?.reduce((sum, p) => sum + p.goalsCount, 0) || 0,
    totalMetrics: plans?.reduce((sum, p) => sum + p.metricsCount, 0) || 0,
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString();
  };

  const getStatusColor = (status: PlanStatus) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "active":
        return "bg-blue-100 text-blue-800";
      case "scheduled":
        return "bg-purple-100 text-purple-800";
      case "draft":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeLabel = (type: PlanType) => {
    switch (type) {
      case "measurement":
        return t("types.measurement");
      case "estimation":
        return t("types.estimation");
      case "quality":
        return t("types.quality");
      case "performance":
        return t("types.performance");
      default:
        return type;
    }
  };

  const resetForm = () => {
    planForm.reset({
      name: "",
      description: "",
      type: "measurement",
      owner: "",
    });
  };

  const refreshData = async () => {
    if (userOrganization) {
      await mutate("/api/plans");
    }
  };

  const createPlan = async (data: PlanFormData) => {
    if (!userOrganization) {
      router.push("/organization");
      return;
    }

    setIsCreatingPlan(true);

    try {
      const newPlan: Plan = {
        id: Date.now().toString(),
        name: data.name,
        description: data.description,
        type: data.type,
        owner: data.owner,
        startDate: new Date(),
        endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        status: "draft",
        progress: 0,
        goalsCount: 0,
        metricsCount: 0,
        gqmPhase: "planning",
      };

      await new Promise((resolve) => setTimeout(resolve, 500));

      await mutate(
        "/api/plans",
        (current: Plan[] | undefined) =>
          current ? [newPlan, ...current] : [newPlan],
        false
      );

      resetForm();
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : t("errors.createFailed")
      );
    } finally {
      setIsCreatingPlan(false);
    }
  };

  const updatePlan = async (data: UpdatePlanRequest) => {
    if (!userOrganization) return;

    setIsUpdatingPlan(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      await mutate(
        "/api/plans",
        (current: Plan[] | undefined) =>
          current?.map((plan) =>
            plan.id === data.id ? { ...plan, ...data } : plan
          ),
        false
      );
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : t("errors.updateFailed")
      );
    } finally {
      setIsUpdatingPlan(false);
    }
  };

  const deletePlan = async (id: string) => {
    if (!userOrganization) return;

    try {
      await new Promise((resolve) => setTimeout(resolve, 300));

      await mutate(
        "/api/plans",
        (current: Plan[] | undefined) =>
          current?.filter((plan) => plan.id !== id),
        false
      );
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : t("errors.deleteFailed")
      );
    }
  };

  const duplicatePlan = async (id: string) => {
    if (!userOrganization || !plans) return;

    const originalPlan = plans.find((p) => p.id === id);
    if (!originalPlan) return;

    try {
      const duplicatedPlan: Plan = {
        ...originalPlan,
        id: Date.now().toString(),
        name: `${originalPlan.name} (Copy)`,
        status: "draft",
        progress: 0,
        goalsCount: 0,
        metricsCount: 0,
        gqmPhase: "planning",
      };

      await new Promise((resolve) => setTimeout(resolve, 300));

      await mutate(
        "/api/plans",
        (current: Plan[] | undefined) =>
          current ? [duplicatedPlan, ...current] : [duplicatedPlan],
        false
      );
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : t("errors.duplicateFailed")
      );
    }
  };

  const applyTemplate = (template: PlanTemplate) => {
    planForm.setValue("name", template.name);
    planForm.setValue("description", template.description);
    planForm.setValue("type", template.type);
  };

  const updateGQMPhase = async (planId: string, phase: GQMPhase) => {
    await updatePlan({ id: planId, gqmPhase: phase });
  };

  const getGQMDataForPlan = (planId: string): GQMData => {
    return {
      goals: gqmData.goals.filter((g) => g.planId === planId),
      questions: gqmData.questions,
      metrics: gqmData.metrics,
    };
  };

  useEffect(() => {
    if (!isLoadingUserOrganization && !userOrganization) {
      router.push("/organization");
    }
  }, [isLoadingUserOrganization, userOrganization, router]);

  return {
    plans,
    templates,
    statistics,
    gqmData,

    isLoadingPlans,
    isCreatingPlan,
    isUpdatingPlan,

    plansError,

    canCreatePlan,
    canEditPlan,
    hasOrganization,

    planForm,
    formErrors,

    createPlan,
    updatePlan,
    deletePlan,
    duplicatePlan,
    applyTemplate,

    updateGQMPhase,
    getGQMDataForPlan,

    formatDate,
    getStatusColor,
    getTypeLabel,
    refreshData,
    resetForm,
  };
};
