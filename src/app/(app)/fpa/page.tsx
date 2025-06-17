"use client";

import { Suspense } from "react";
import { FPAWorkflow } from "@/presentation/views/FPA/FPAWorkflow";

function FPAWorkflowWrapper() {
  return <FPAWorkflow />;
}

export default function FPAPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-4xl mx-auto p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-secondary">Loading...</p>
            </div>
          </div>
        </div>
      }
    >
      <FPAWorkflowWrapper />
    </Suspense>
  );
}
