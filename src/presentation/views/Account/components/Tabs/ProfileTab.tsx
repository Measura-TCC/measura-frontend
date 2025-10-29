import { useState } from "react";
import { useTranslation } from "react-i18next";
import { UseFormReturn } from "react-hook-form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Input,
} from "@/presentation/components/primitives";
import { UserIcon, CheckIcon } from "@/presentation/assets/icons";
import type { ProfileFormData, AccountStatistics, User } from "@/core/types";

interface ProfileTabProps {
  user: User | null;
  statistics: AccountStatistics;
  decodedRole: string;
  canUpdateProfile: boolean;
  isUpdatingProfile: boolean;
  profileForm: UseFormReturn<ProfileFormData>;
  profileErrors: Record<string, { message?: string }>;
  onUpdateProfile: (data: ProfileFormData) => Promise<void>;
  formatDate: (date: Date | string) => string;
  getAccountStatus: () => "active" | "inactive" | "pending";
}

export const ProfileTab: React.FC<ProfileTabProps> = ({
  user, // eslint-disable-line @typescript-eslint/no-unused-vars
  statistics,
  decodedRole,
  canUpdateProfile,
  isUpdatingProfile,
  profileForm,
  profileErrors,
  onUpdateProfile,
  formatDate, // eslint-disable-line @typescript-eslint/no-unused-vars
  getAccountStatus, // eslint-disable-line @typescript-eslint/no-unused-vars
}) => {
  const { t } = useTranslation("account");
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  const { register, handleSubmit } = profileForm;

  const handleUpdateSubmit = async (data: ProfileFormData) => {
    setUpdateError(null);
    setUpdateSuccess(false);
    try {
      await onUpdateProfile(data);
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (err) {
      const error = err as { response?: { status: number; data?: { message?: string } } };
      console.error("Error updating profile:", error);

      if (error.response?.status === 409) {
        setUpdateError(t("profile.usernameAlreadyExists"));
      } else {
        setUpdateError(t("profile.updateError"));
      }
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      active: "text-green-600",
      inactive: "text-red-600",
      pending: "text-yellow-600",
    };
    return colors[status as keyof typeof colors] || colors.active;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Card className={!canUpdateProfile ? "opacity-50" : ""}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserIcon className="w-5 h-5 text-primary" />
              {t("profile.title")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <form
              onSubmit={handleSubmit(handleUpdateSubmit)}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label
                    htmlFor="username"
                    className="text-sm font-medium text-default"
                  >
                    {t("form.usernameLabel")}
                  </label>
                  <Input
                    id="username"
                    {...register("username")}
                    placeholder={t("form.usernamePlaceholder")}
                    disabled={!canUpdateProfile}
                  />
                  {profileErrors.username && (
                    <p className="text-sm text-red-600">
                      {profileErrors.username.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="text-sm font-medium text-default"
                  >
                    {t("form.emailLabel")}
                  </label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    placeholder={t("form.emailPlaceholder")}
                    disabled={!canUpdateProfile}
                  />
                  {profileErrors.email && (
                    <p className="text-sm text-red-600">
                      {profileErrors.email.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="role"
                  className="text-sm font-medium text-default"
                >
                  {t("form.roleLabel")}
                </label>
                <Input
                  id="role"
                  value={decodedRole || ""}
                  disabled
                  className="bg-background-secondary text-muted cursor-not-allowed"
                />
              </div>

              {updateSuccess && (
                <div className="rounded-md bg-green-50 p-4">
                  <div className="flex items-center">
                    <CheckIcon className="w-4 h-4 text-green-400 mr-2" />
                    <p className="text-sm text-green-700">
                      {t("form.updateSuccess")}
                    </p>
                  </div>
                </div>
              )}

              {updateError && (
                <div className="rounded-md bg-red-50 p-4">
                  <p className="text-sm text-red-700">{updateError}</p>
                </div>
              )}

              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={!canUpdateProfile || isUpdatingProfile}
                  className="w-full md:w-auto"
                >
                  {isUpdatingProfile
                    ? t("form.updating")
                    : t("form.updateButton")}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{t("statistics.title")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-sm text-muted">
                  {t("statistics.currentRole")}
                </span>
                <span className="text-sm font-medium">
                  {decodedRole || "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-sm text-muted">
                  {t("statistics.accountStatus")}
                </span>
                <span
                  className={`text-sm font-medium ${getStatusColor(
                    statistics.accountStatus
                  )}`}
                >
                  {t(
                    `statistics.${statistics.accountStatus}`,
                    statistics.accountStatus
                  )}
                </span>
              </div>
              {statistics.organizationName && (
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-muted">
                    {t("statistics.organization")}
                  </span>
                  <span className="text-sm font-medium">
                    {statistics.organizationName}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
