"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
} from "@/presentation/components/primitives";
import {
  DocumentIcon,
  PlusIcon,
  BuildingIcon,
  TargetIcon,
} from "@/presentation/assets/icons";
import { mockPlans, type Plan, type PlanType } from "./utils/mockPlans";
import { useUserOrganization } from "@/core/hooks/organizations/useOrganizations";
import { GQMView } from "../GQM/GQM";

type TabType = "plans" | "gqm";

export const PlansView = () => {
  const { t } = useTranslation("plans");
  const { t: tGqm } = useTranslation("gqm");
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("plans");
  const [plans, setPlans] = useState<Plan[]>(mockPlans);
  const { userOrganization, isLoadingUserOrganization } = useUserOrganization();

  const [newPlan, setNewPlan] = useState({
    name: "",
    description: "",
    type: "measurement" as PlanType,
    owner: "",
  });

  const handleCreatePlan = () => {
    if (!userOrganization) {
      router.push("/organization");
      return;
    }

    if (!newPlan.name || !newPlan.description || !newPlan.owner) return;

    const plan: Plan = {
      id: Date.now().toString(),
      name: newPlan.name,
      description: newPlan.description,
      type: newPlan.type,
      startDate: new Date(),
      endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      status: "draft",
      owner: newPlan.owner,
      progress: 0,
      goalsCount: 0,
      metricsCount: 0,
    };

    setPlans((prev) => [plan, ...prev]);
    setNewPlan({ name: "", description: "", type: "measurement", owner: "" });
  };

  const handleTemplateSelect = (templateType: string) => {
    if (!userOrganization) {
      router.push("/organization");
      return;
    }

    const templates = {
      quality: {
        name: "Quality Assurance Plan",
        description: "Comprehensive quality measurement and improvement plan",
        type: "quality" as PlanType,
      },
      productivity: {
        name: "Productivity Analysis Plan",
        description: "Team productivity measurement and optimization plan",
        type: "measurement" as PlanType,
      },
      performance: {
        name: "Project Performance Plan",
        description: "Project delivery and performance tracking plan",
        type: "performance" as PlanType,
      },
    };

    const template = templates[templateType as keyof typeof templates];
    if (template) {
      setNewPlan({
        name: template.name,
        description: template.description,
        type: template.type,
        owner: "",
      });
    }
  };

  if (isLoadingUserOrganization) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="animate-pulse bg-gray-200 h-64 rounded-lg"></div>
            <div className="animate-pulse bg-gray-200 h-32 rounded-lg"></div>
          </div>
          <div className="space-y-6">
            <div className="animate-pulse bg-gray-200 h-48 rounded-lg"></div>
            <div className="animate-pulse bg-gray-200 h-32 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-default">{t("title")}</h1>
        <p className="text-muted mt-1">{t("subtitle")}</p>
        {userOrganization && (
          <p className="text-sm text-secondary mt-1 flex items-center gap-2">
            <BuildingIcon className="w-4 h-4" />
            {userOrganization.name}
          </p>
        )}
      </div>

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("plans")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "plans"
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <DocumentIcon className="w-4 h-4 inline mr-2" />
            {t("title")}
          </button>
          <button
            onClick={() => setActiveTab("gqm")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "gqm"
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <TargetIcon className="w-4 h-4 inline mr-2" />
            {tGqm("title")}
          </button>
        </nav>
      </div>

      {activeTab === "plans" && (
        <>
          {!userOrganization && (
            <Card className="border-amber-200 bg-amber-50">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-3">
                  <BuildingIcon className="w-6 h-6 text-amber-600" />
                  <div className="flex-1">
                    <h3 className="font-medium text-amber-900">
                      Organization Required
                    </h3>
                    <p className="text-sm text-amber-700 mt-1">
                      You need to create or join an organization to create
                      measurement plans and manage planning activities.
                    </p>
                  </div>
                  <Button
                    onClick={() => router.push("/organization")}
                    size="sm"
                    className="bg-amber-600 hover:bg-amber-700"
                  >
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Create Organization
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card className={!userOrganization ? "opacity-50" : ""}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PlusIcon className="w-5 h-5 text-primary" />
                    {t("createNewPlan")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label
                        htmlFor="planName"
                        className="text-sm font-medium text-default"
                      >
                        {t("planName")}
                      </label>
                      <Input
                        id="planName"
                        value={newPlan.name}
                        onChange={(e) =>
                          setNewPlan((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        placeholder={t("enterPlanName")}
                        disabled={!userOrganization}
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="owner"
                        className="text-sm font-medium text-default"
                      >
                        {t("owner")}
                      </label>
                      <Input
                        id="owner"
                        value={newPlan.owner}
                        onChange={(e) =>
                          setNewPlan((prev) => ({
                            ...prev,
                            owner: e.target.value,
                          }))
                        }
                        placeholder={t("enterOwnerName")}
                        disabled={!userOrganization}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="description"
                      className="text-sm font-medium text-default"
                    >
                      {t("description")}
                    </label>
                    <Input
                      id="description"
                      value={newPlan.description}
                      onChange={(e) =>
                        setNewPlan((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      placeholder={t("enterDescription")}
                      disabled={!userOrganization}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-default">
                      {t("type")}
                    </label>
                    <div className="flex space-x-4">
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          value="measurement"
                          checked={newPlan.type === "measurement"}
                          onChange={(e) =>
                            setNewPlan((prev) => ({
                              ...prev,
                              type: e.target.value as PlanType,
                            }))
                          }
                          disabled={!userOrganization}
                          className="text-primary focus:ring-primary"
                        />
                        <span className="text-sm text-default">
                          Measurement
                        </span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          value="quality"
                          checked={newPlan.type === "quality"}
                          onChange={(e) =>
                            setNewPlan((prev) => ({
                              ...prev,
                              type: e.target.value as PlanType,
                            }))
                          }
                          disabled={!userOrganization}
                          className="text-primary focus:ring-primary"
                        />
                        <span className="text-sm text-default">Quality</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          value="performance"
                          checked={newPlan.type === "performance"}
                          onChange={(e) =>
                            setNewPlan((prev) => ({
                              ...prev,
                              type: e.target.value as PlanType,
                            }))
                          }
                          disabled={!userOrganization}
                          className="text-primary focus:ring-primary"
                        />
                        <span className="text-sm text-default">
                          Performance
                        </span>
                      </label>
                    </div>
                  </div>
                  <Button
                    onClick={handleCreatePlan}
                    className="w-full md:w-auto"
                    disabled={!userOrganization}
                  >
                    <PlusIcon className="w-4 h-4 mr-2" />
                    {t("createPlan")}
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t("yourPlans")}</CardTitle>
                </CardHeader>
                <CardContent>
                  {plans.length === 0 ? (
                    <div className="text-center py-8">
                      <DocumentIcon className="w-12 h-12 text-muted mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-default mb-2">
                        No Plans Yet
                      </h3>
                      <p className="text-secondary mb-4">
                        Create your first measurement plan to organize and track
                        your software measurement activities.
                      </p>
                      {userOrganization && (
                        <Button
                          onClick={() =>
                            setNewPlan({
                              name: "",
                              description: "",
                              type: "measurement",
                              owner: "",
                            })
                          }
                        >
                          <PlusIcon className="w-4 h-4 mr-2" />
                          Create Your First Plan
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {plans.map((plan) => (
                        <div
                          key={plan.id}
                          className="p-4 border border-border rounded-lg hover:shadow-sm transition-shadow"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-medium text-default">
                              {plan.name}
                            </h3>
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${
                                plan.status === "completed"
                                  ? "bg-green-100 text-green-800"
                                  : plan.status === "active"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {t(`status.${plan.status}`)}
                            </span>
                          </div>
                          <p className="text-sm text-secondary mb-3">
                            {plan.description}
                          </p>
                          <div className="grid grid-cols-2 gap-4 mb-3">
                            <div>
                              <h4 className="text-xs font-medium text-secondary mb-1">
                                {t("type")}:
                              </h4>
                              <span className="px-2 py-1 bg-background-secondary text-xs rounded capitalize">
                                {plan.type}
                              </span>
                            </div>
                            <div>
                              <h4 className="text-xs font-medium text-secondary mb-1">
                                {t("owner")}:
                              </h4>
                              <span className="px-2 py-1 bg-background-secondary text-xs rounded">
                                {plan.owner}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-xs text-muted">
                            <span>
                              {plan.startDate.toLocaleDateString()} -{" "}
                              {plan.endDate.toLocaleDateString()}
                            </span>
                            <div className="flex items-center space-x-4">
                              <span>{plan.goalsCount} goals</span>
                              <span>{plan.metricsCount} metrics</span>
                              <span>{plan.progress}% complete</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className={!userOrganization ? "opacity-50" : ""}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DocumentIcon className="w-5 h-5 text-primary" />
                    {t("templates")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div
                    className={`p-3 border border-border rounded-lg transition-colors ${
                      userOrganization
                        ? "cursor-pointer hover:bg-background-secondary hover:border-primary/20"
                        : "cursor-not-allowed"
                    }`}
                    onClick={() => handleTemplateSelect("quality")}
                  >
                    <h4 className="font-medium text-default text-sm">
                      {t("qualityAssurance")}
                    </h4>
                    <p className="text-xs text-muted mt-1">
                      {t("qualityDescription")}
                    </p>
                  </div>
                  <div
                    className={`p-3 border border-border rounded-lg transition-colors ${
                      userOrganization
                        ? "cursor-pointer hover:bg-background-secondary hover:border-primary/20"
                        : "cursor-not-allowed"
                    }`}
                    onClick={() => handleTemplateSelect("productivity")}
                  >
                    <h4 className="font-medium text-default text-sm">
                      {t("productivityAnalysis")}
                    </h4>
                    <p className="text-xs text-muted mt-1">
                      {t("productivityDescription")}
                    </p>
                  </div>
                  <div
                    className={`p-3 border border-border rounded-lg transition-colors ${
                      userOrganization
                        ? "cursor-pointer hover:bg-background-secondary hover:border-primary/20"
                        : "cursor-not-allowed"
                    }`}
                    onClick={() => handleTemplateSelect("performance")}
                  >
                    <h4 className="font-medium text-default text-sm">
                      {t("projectPerformance")}
                    </h4>
                    <p className="text-xs text-muted mt-1">
                      {t("performanceDescription")}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t("statistics")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-secondary">Total Plans</span>
                    <span className="font-semibold text-default">
                      {plans.length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-secondary">Active</span>
                    <span className="font-semibold text-default">
                      {plans.filter((p) => p.status === "active").length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-secondary">Completed</span>
                    <span className="font-semibold text-default">
                      {plans.filter((p) => p.status === "completed").length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-secondary">Average Progress</span>
                    <span className="font-semibold text-default">
                      {plans.length > 0
                        ? Math.round(
                            plans.reduce((acc, p) => acc + p.progress, 0) /
                              plans.length
                          )
                        : 0}
                      %
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      )}

      {activeTab === "gqm" && (
        <div className="mt-6">
          <GQMView />
        </div>
      )}
    </div>
  );
};
