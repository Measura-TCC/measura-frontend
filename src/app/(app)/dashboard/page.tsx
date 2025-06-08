"use client";

import { DashboardView } from "@/presentation/views";
import { useAuth } from "@/core/hooks/auth/useAuth";

const DashboardPage = () => {
  const { user } = useAuth();

  const dashboardUser = user
    ? {
        name: user.username,
        role: user.role,
      }
    : {
        name: "Guest",
        role: "user",
      };

  return <DashboardView user={dashboardUser} />;
};

export default DashboardPage;
