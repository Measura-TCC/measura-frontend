"use client";

import { use } from "react";
import { PlanDetailsView } from "@/presentation/views/Plans/PlanDetails/PlanDetails";

interface PlanDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function PlanDetailsPage({ params }: PlanDetailsPageProps) {
  const { id } = use(params);
  return <PlanDetailsView planId={id} />;
}