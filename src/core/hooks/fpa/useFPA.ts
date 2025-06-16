import { useState, useEffect } from "react";
import { useForm, FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import useSWR, { mutate } from "swr";
import { useUserOrganization } from "@/core/hooks/organizations/useOrganizations";
import {
  Estimate,
  EstimateFormData,
  UpdateEstimateRequest,
  FPAStatistics,
  EstimateStatus,
  FunctionTypeInfo,
  ComplexityInfo,
} from "@/core/types/fpa";
import { getFunctionTypes, getComplexityLevels } from "@/core/utils/fpaItems";

const createEstimateSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z.string().optional(),
});

export type UseFPAReturn = {
  estimates: Estimate[] | undefined;
  statistics: FPAStatistics;
  functionTypes: FunctionTypeInfo[];
  complexityLevels: ComplexityInfo[];

  isLoadingEstimates: boolean;
  isCreatingEstimate: boolean;
  isUpdatingEstimate: boolean;

  estimatesError: Error | null;

  canCreateEstimate: boolean;
  canEditEstimate: boolean;
  hasOrganization: boolean;

  estimateForm: ReturnType<typeof useForm<EstimateFormData>>;
  formErrors: FieldErrors<EstimateFormData>;

  createEstimate: (data: EstimateFormData) => Promise<void>;
  updateEstimate: (data: UpdateEstimateRequest) => Promise<void>;
  deleteEstimate: (id: string) => Promise<void>;
  duplicateEstimate: (id: string) => Promise<void>;

  formatDate: (date: Date | string) => string;
  getStatusColor: (status: EstimateStatus) => string;
  refreshData: () => Promise<void>;
  resetForm: () => void;
};

export const useFPA = (): UseFPAReturn => {
  const { t } = useTranslation("fpa");
  const router = useRouter();
  const { userOrganization, isLoadingUserOrganization } = useUserOrganization();

  const [isCreatingEstimate, setIsCreatingEstimate] = useState(false);
  const [isUpdatingEstimate, setIsUpdatingEstimate] = useState(false);

  const estimateForm = useForm<EstimateFormData>({
    resolver: zodResolver(createEstimateSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const {
    formState: { errors: formErrors },
  } = estimateForm;

  const {
    data: estimates,
    error: estimatesError,
    isLoading: isLoadingEstimates,
  } = useSWR(userOrganization ? "/api/estimates" : null, async () => {
    const mockEstimates: Estimate[] = [
      {
        id: "1",
        name: "E-commerce Platform",
        description: "Online retail platform with payment integration",
        totalPoints: 245,
        createdAt: new Date("2024-01-15"),
        status: "completed",
      },
      {
        id: "2",
        name: "CRM System",
        description: "Customer relationship management system",
        totalPoints: 189,
        createdAt: new Date("2024-01-10"),
        status: "in_progress",
      },
      {
        id: "3",
        name: "Inventory Management",
        description: "Real-time inventory tracking system",
        totalPoints: 156,
        createdAt: new Date("2024-01-08"),
        status: "completed",
      },
    ];

    await new Promise((resolve) => setTimeout(resolve, 1000));
    return mockEstimates;
  });

  const statistics: FPAStatistics = {
    totalEstimates: estimates?.length || 0,
    completedEstimates:
      estimates?.filter((e) => e.status === "completed").length || 0,
    inProgressEstimates:
      estimates?.filter((e) => e.status === "in_progress").length || 0,
    draftEstimates: estimates?.filter((e) => e.status === "draft").length || 0,
    totalFunctionPoints:
      estimates?.reduce((sum, e) => sum + e.totalPoints, 0) || 0,
    averagePoints:
      estimates && estimates.length > 0
        ? Math.round(
            estimates.reduce((sum, e) => sum + e.totalPoints, 0) /
              estimates.length
          )
        : 0,
  };

  const functionTypes = getFunctionTypes(t);
  const complexityLevels = getComplexityLevels(t);

  const canCreateEstimate = !!userOrganization && !isLoadingUserOrganization;
  const canEditEstimate = !!userOrganization && !isLoadingUserOrganization;
  const hasOrganization = !!userOrganization;

  const formatDate = (date: Date | string): string => {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status: EstimateStatus): string => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "draft":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const refreshData = async () => {
    if (userOrganization) {
      await mutate("/api/estimates");
    }
  };

  const createEstimate = async (data: EstimateFormData) => {
    if (!userOrganization) {
      router.push("/organization");
      return;
    }

    setIsCreatingEstimate(true);

    try {
      const newEstimate: Estimate = {
        id: Date.now().toString(),
        name: data.name,
        description: data.description,
        totalPoints: 0,
        createdAt: new Date(),
        status: "draft",
      };

      await new Promise((resolve) => setTimeout(resolve, 500));

      await mutate(
        "/api/estimates",
        (current: Estimate[] | undefined) =>
          current ? [newEstimate, ...current] : [newEstimate],
        false
      );

      resetForm();
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : t("errors.createFailed")
      );
    } finally {
      setIsCreatingEstimate(false);
    }
  };

  const updateEstimate = async (data: UpdateEstimateRequest) => {
    if (!userOrganization) return;

    setIsUpdatingEstimate(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      await mutate(
        "/api/estimates",
        (current: Estimate[] | undefined) =>
          current?.map((estimate) =>
            estimate.id === data.id
              ? { ...estimate, ...data, updatedAt: new Date() }
              : estimate
          ),
        false
      );
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : t("errors.updateFailed")
      );
    } finally {
      setIsUpdatingEstimate(false);
    }
  };

  const deleteEstimate = async (id: string) => {
    if (!userOrganization) return;

    try {
      await new Promise((resolve) => setTimeout(resolve, 300));

      await mutate(
        "/api/estimates",
        (current: Estimate[] | undefined) =>
          current?.filter((estimate) => estimate.id !== id),
        false
      );
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : t("errors.deleteFailed")
      );
    }
  };

  const duplicateEstimate = async (id: string) => {
    if (!userOrganization || !estimates) return;

    const originalEstimate = estimates.find((e) => e.id === id);
    if (!originalEstimate) return;

    try {
      const duplicatedEstimate: Estimate = {
        ...originalEstimate,
        id: Date.now().toString(),
        name: `${originalEstimate.name} (Copy)`,
        createdAt: new Date(),
        status: "draft",
        totalPoints: 0,
      };

      await new Promise((resolve) => setTimeout(resolve, 300));

      await mutate(
        "/api/estimates",
        (current: Estimate[] | undefined) =>
          current ? [duplicatedEstimate, ...current] : [duplicatedEstimate],
        false
      );
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : t("errors.duplicateFailed")
      );
    }
  };

  const resetForm = () => {
    estimateForm.reset();
  };

  useEffect(() => {
    if (!isLoadingUserOrganization && !userOrganization) {
      router.push("/organization");
    }
  }, [isLoadingUserOrganization, userOrganization, router]);

  return {
    estimates,
    statistics,
    functionTypes,
    complexityLevels,
    isLoadingEstimates,
    isCreatingEstimate,
    isUpdatingEstimate,
    estimatesError,
    canCreateEstimate,
    canEditEstimate,
    hasOrganization,
    estimateForm,
    formErrors,
    createEstimate,
    updateEstimate,
    deleteEstimate,
    duplicateEstimate,
    formatDate,
    getStatusColor,
    refreshData,
    resetForm,
  };
};
