import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
} from "@/presentation/components/primitives";
import { BuildingIcon, PlusIcon } from "@/presentation/assets/icons";

interface Organization {
  _id: string;
  name: string;
  description?: string;
  industry?: string;
  website?: string;
  createdAt: string;
}

interface OrganizationSectionProps {
  userOrganization?: Organization | null;
  isLoadingUserOrganization: boolean;
  onCreateOrganization: () => void;
  onManageOrganization: () => void;
}

export const OrganizationSection: React.FC<OrganizationSectionProps> = ({
  userOrganization,
  isLoadingUserOrganization,
  onCreateOrganization,
  onManageOrganization,
}) => {
  const { t } = useTranslation("organization");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BuildingIcon className="w-5 h-5 text-primary" />
          {t("title")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoadingUserOrganization ? (
          <div className="space-y-2">
            <div className="animate-pulse bg-gray-200 h-4 w-3/4 rounded"></div>
            <div className="animate-pulse bg-gray-200 h-3 w-1/2 rounded"></div>
          </div>
        ) : userOrganization ? (
          <div className="space-y-2">
            <p className="font-semibold text-default">
              {userOrganization.name}
            </p>
            {userOrganization.industry && (
              <p className="text-sm text-secondary">
                {userOrganization.industry}
              </p>
            )}
            {userOrganization.website && (
              <a
                href={userOrganization.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline"
              >
                {t("visitWebsite")}
              </a>
            )}
            <p className="text-xs text-muted">
              {t("memberSince")}{" "}
              {new Date(userOrganization.createdAt).toLocaleDateString()}
            </p>
            <Button
              size="sm"
              variant="ghost"
              onClick={onManageOrganization}
              className="mt-2"
            >
              {t("manageOrganization")}
            </Button>
          </div>
        ) : (
          <div className="text-center space-y-2">
            <p className="text-sm text-secondary">
              {t("noOrganizationAssigned")}
            </p>
            <Button
              size="sm"
              variant="secondary"
              onClick={onCreateOrganization}
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              {t("createOrganization")}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
