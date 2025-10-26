import { useAuth } from "../auth";
import { userService } from "@/core/services";

export const useWelcomeTour = () => {
  const { user, updateUser } = useAuth();

  const shouldShowTour = !user?.hasCompletedOnboarding;

  const completeTour = async () => {
    if (!user) return;

    try {
      await userService.updateMyProfile({
        hasCompletedOnboarding: true,
      });

      updateUser({ hasCompletedOnboarding: true });
    } catch (error) {
      console.error("Failed to update onboarding status:", error);
      throw error;
    }
  };

  return {
    shouldShowTour,
    completeTour,
  };
};
