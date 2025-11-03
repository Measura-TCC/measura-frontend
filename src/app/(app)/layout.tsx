"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Header, Sidebar } from "@/presentation/components/layout";
import { useAuth } from "@/core/hooks/auth/useAuth";
import { SpinnerIcon } from "@/presentation/assets/icons";
import measuraLogo from "@/presentation/assets/images/measura-logo.png";
import Image from "next/image";

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (!isAuthenticated) {
        router.push("/login");
      }
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="flex justify-center mb-4">
            <Image
              src={measuraLogo}
              alt="Measura Logo"
              width={200}
              height={50}
              priority
            />
          </div>
          <SpinnerIcon className="w-12 h-12 mx-auto animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 lg:ml-64 pt-4 md:pt-14 max-w-full">
          <div className="container mx-auto px-4 md:px-12 py-6">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
