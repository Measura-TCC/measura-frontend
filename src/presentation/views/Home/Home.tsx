"use client";

import { useHome } from "@/core/hooks/home/useHome";
import {
  HeaderSection,
  HeroSection,
  FeaturesSection,
  BenefitsSection,
  TeamSection,
  FooterSection,
  LoadingSection,
} from "./components";

interface HomeViewProps {
  isAuthenticated: boolean;
  isLoading: boolean;
  onLogin: () => void;
}

export const HomeView = ({
  isAuthenticated,
  isLoading,
  onLogin,
}: HomeViewProps) => {
  const homeHook = useHome({ isAuthenticated, isLoading, onLogin });

  const { isLoading: homeIsLoading, handleGetStarted } = homeHook;

  if (isLoading) {
    return <LoadingSection />;
  }

  return (
    <div className="min-h-screen">
      <HeaderSection
        isLoading={homeIsLoading}
        onGetStarted={handleGetStarted}
      />

      <div className="animate-fade-in">
        <HeroSection
          isAuthenticated={isAuthenticated}
          onGetStarted={handleGetStarted}
        />
      </div>

      <div className="animate-slide-up animation-delay-200">
        <FeaturesSection />
      </div>

      <div className="animate-slide-up animation-delay-300">
        <BenefitsSection />
      </div>

      <div className="animate-slide-up animation-delay-500">
        <TeamSection />
      </div>

      <FooterSection />
    </div>
  );
};
