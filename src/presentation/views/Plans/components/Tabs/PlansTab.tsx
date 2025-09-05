"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from "@/presentation/components/primitives";
import type { Plan } from "../../utils/mockPlans";

export const PlansTab = ({ plans, setPlans }: { plans: Plan[]; setPlans: (fn: (prev: Plan[]) => Plan[]) => void }) => {
  const { t } = useTranslation("plans");
  const [newPlan, setNewPlan] = useState({ name: "", description: "", type: "measurement" as const, owner: "" });

  const handleCreatePlan = () => {
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t("createNewPlan")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-default">{t("planName")}</label>
              <Input value={newPlan.name} onChange={(e) => setNewPlan((p) => ({ ...p, name: e.target.value }))} placeholder={t("enterPlanName")} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-default">{t("owner")}</label>
              <Input value={newPlan.owner} onChange={(e) => setNewPlan((p) => ({ ...p, owner: e.target.value }))} placeholder={t("enterPlanOwner")} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-default">{t("planDescription")}</label>
              <Input value={newPlan.description} onChange={(e) => setNewPlan((p) => ({ ...p, description: e.target.value }))} placeholder={t("descriptionPlaceholder")} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-default">{t("type")}</label>
              <Input value={newPlan.type} onChange={(e) => setNewPlan((p) => ({ ...p, type: e.target.value as typeof p.type }))} placeholder={t("enterPlanType")} />
            </div>
          </div>
          <Button onClick={handleCreatePlan}>{t("createPlan")}</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("yourPlans")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {plans.map((plan) => (
              <div key={plan.id} className="p-4 border border-border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-default">{plan.name}</h3>
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
                <p className="text-sm text-secondary mb-3">{plan.description}</p>
                <div className="mb-2">
                  <h4 className="text-xs font-medium text-secondary mb-1">{t("type")}:</h4>
                  <span className="px-2 py-1 bg-background-secondary text-xs rounded">{plan.type}</span>
                </div>
                <div className="mb-2">
                  <h4 className="text-xs font-medium text-secondary mb-1">{t("owner")}:</h4>
                  <span className="px-2 py-1 bg-background-secondary text-xs rounded">{plan.owner}</span>
                </div>
                <div className="mb-2">
                  <h4 className="text-xs font-medium text-secondary mb-1">{t("progress")}:</h4>
                  <div className="w-full bg-background-secondary rounded-full h-2">
                    <div className="h-2 bg-primary rounded-full transition-all duration-300" style={{ width: `${plan.progress}%` }} />
                  </div>
                  <span className="text-xs text-muted mt-1">{plan.progress}%</span>
                </div>
                <p className="text-xs text-muted">
                  {plan.startDate.toLocaleDateString()} - {plan.endDate.toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

