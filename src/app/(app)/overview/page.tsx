"use client";

import { OverviewView } from "@/presentation/views";
import { useAuth } from "@/core/hooks/auth/useAuth";

const OverviewPage = () => {
  const { user } = useAuth();

  const overviewUser = user
    ? {
        name: user.username,
        role: user.role,
      }
    : {
        name: "Guest",
        role: "user",
      };

  return <OverviewView user={overviewUser} />;
};

export default OverviewPage;
