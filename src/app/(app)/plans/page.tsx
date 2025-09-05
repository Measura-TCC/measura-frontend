"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/presentation/components/primitives";
import { DocumentIcon } from "@/presentation/assets/icons";

const PlansPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-default">Plans</h1>
        <p className="text-secondary">Project planning and management</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DocumentIcon className="w-5 h-5" />
            Plans Module
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <DocumentIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-default mb-2">
              Plans Module Coming Soon
            </h3>
            <p className="text-secondary max-w-md mx-auto">
              The Plans module is currently under development and will be
              available soon. This feature will allow you to create and manage
              project plans with comprehensive goal-question-metric (GQM)
              frameworks.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlansPage;
