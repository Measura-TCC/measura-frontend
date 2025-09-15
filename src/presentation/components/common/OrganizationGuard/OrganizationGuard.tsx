import React from "react";
import { useOrganization } from "@/core/hooks/organizations/useOrganization";
import { InfoBox } from "@/presentation/components/common/InfoBox/InfoBox";

interface OrganizationGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const OrganizationGuard: React.FC<OrganizationGuardProps> = ({
  children,
  fallback,
}) => {
  const { hasAccess } = useOrganization();

  if (!hasAccess) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center max-w-md">
          <InfoBox variant="muted" size="lg">
            <div>
              <h3 className="font-semibold mb-2">Organization Access Required</h3>
              <p className="text-sm opacity-80">
                Please contact your administrator to be assigned to an organization to access this feature.
              </p>
            </div>
          </InfoBox>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};