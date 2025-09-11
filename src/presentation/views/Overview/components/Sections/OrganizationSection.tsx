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
  mission?: string;
  vision?: string;
  values?: string;
  strategicObjectives?: string;
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
  const mission = userOrganization?.mission ?? t("mock.mission");
  const vision = userOrganization?.vision ?? t("mock.vision");
  const values = userOrganization?.values ?? t("mock.values");
  const strategicObjectives =
    userOrganization?.strategicObjectives ?? t("mock.strategicObjectives");

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
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-md font-medium text-gray-700">
                  {t("name")}
                </label>
                <p className="text-secondary">{userOrganization.name}</p>
              </div>

              {userOrganization.industry && (
                <div>
                  <label className="text-md font-medium text-gray-700">
                    {t("industry")}
                  </label>
                  <p className="text-secondary">{userOrganization.industry}</p>
                </div>
              )}

              <div>
                <label className="text-md font-medium text-gray-700">
                  {t("created")}
                </label>
                <p className="text-secondary text-sm">
                  {new Date(userOrganization.createdAt).toLocaleDateString()}
                </p>
              </div>

              {userOrganization.website && (
                <div>
                  <label className="text-md font-medium text-gray-700">
                    {t("website")}
                  </label>
                  <a
                    href={userOrganization.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline block truncate text-sm"
                  >
                    {userOrganization.website}
                  </a>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {userOrganization.description && (
                <div>
                  <label className="text-md font-medium text-gray-700">
                    {t("description")}
                  </label>
                  <p className="text-secondary text-sm">
                    {userOrganization.description}
                  </p>
                </div>
              )}

              <div>
                <label className="text-md font-medium text-gray-700">
                  {t("mission")}
                </label>
                <p className="text-secondary text-sm whitespace-pre-line">
                  {mission}
                </p>
              </div>

              <div>
                <label className="text-md font-medium text-gray-700">
                  {t("vision")}
                </label>
                <p className="text-secondary text-sm whitespace-pre-line">
                  {vision}
                </p>
              </div>

              <div>
                <label className="text-md font-medium text-gray-700">
                  {t("values")}
                </label>
                <p className="text-secondary text-sm whitespace-pre-line">
                  {values}
                </p>
              </div>

              <div>
                <label className="text-md font-medium text-gray-700">
                  {t("strategicObjectives")}
                </label>
                <div className="text-secondary text-sm whitespace-pre-line">
                  <style jsx>{`
                    .strategic-objectives {
                      counter-reset: objective-counter;
                    }
                    .strategic-objectives p {
                      margin: 0;
                      padding: 0;
                    }
                    .strategic-objectives .objective-item {
                      counter-increment: objective-counter;
                      position: relative;
                      padding-left: 1.5rem;
                      margin-bottom: 0.5rem;
                      display: block;
                    }
                    .strategic-objectives .objective-item::before {
                      content: counter(objective-counter) ")";
                      position: absolute;
                      left: 0;
                      font-weight: 600;
                      color: #8b5cf6;
                    }
                  `}</style>
                  <div className="strategic-objectives">
                    {strategicObjectives.split("\n").map(
                      (objective, index) =>
                        objective.trim() && (
                          <span key={index} className="objective-item">
                            {objective.replace(/^\d+\)\s*/, "")}
                          </span>
                        )
                    )}
                  </div>
                </div>
              </div>
            </div>

            <Button
              size="sm"
              variant="primary"
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
