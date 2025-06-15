import { useTranslation } from "react-i18next";
import { Button } from "@/presentation/components/primitives";
import { LanguageSwitcher } from "@/presentation/components/common/LanguageSwitcher/LanguageSwitcher";
import Image from "next/image";
import measuraLogo from "@/presentation/assets/images/measura-logo.png";
import { HamburgerIcon, CloseIcon } from "@/presentation/assets/icons";
import { navItems } from "../utils/nav";
import { getActiveSection } from "../utils/scrollDetection";
import { useState, useEffect } from "react";

interface HeaderSectionProps {
  isLoading: boolean;
  onGetStarted: () => void;
}

export const HeaderSection: React.FC<HeaderSectionProps> = ({
  isLoading,
  onGetStarted,
}) => {
  const { t } = useTranslation(["common", "home"]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      const newActiveSection = getActiveSection();
      setActiveSection(newActiveSection);
    };

    let ticking = false;
    const throttledHandleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", throttledHandleScroll, { passive: true });

    setTimeout(handleScroll, 100);

    return () => window.removeEventListener("scroll", throttledHandleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false);
    if (href.startsWith("#")) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <header className="fixed py-1 top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Image src={measuraLogo} alt="Measura" width={150} height={150} />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <nav className="hidden md:flex items-center space-x-8 mr-10">
              {navItems.map((item) => (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item.href);
                  }}
                  className={`transition-all duration-300 ease-in-out font-medium ${
                    activeSection === item.id
                      ? "text-primary border-b-2 border-primary pb-1"
                      : "text-secondary hover:text-primary border-b-2 border-transparent pb-1"
                  }`}
                >
                  {t(`navigation.${item.id}`, { ns: "home" })}
                </a>
              ))}
            </nav>
            <div className="hidden md:block">
              <LanguageSwitcher />
            </div>

            <Button
              onClick={onGetStarted}
              size="sm"
              className="bg-primary min-w-[8rem] hover:bg-primary-dark text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
              disabled={isLoading}
            >
              <span className="hidden md:inline">{t("getStartedFree")}</span>
              <span className="md:hidden">
                {t("navigation.explore", { ns: "home" })}
              </span>
            </Button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-secondary hover:text-primary transition-all duration-300"
              aria-label="Toggle mobile menu"
            >
              <div className="relative w-6 h-6">
                <HamburgerIcon
                  className={`w-6 h-6 absolute transition-all duration-300 ${
                    isMobileMenuOpen
                      ? "opacity-0 rotate-180"
                      : "opacity-100 rotate-0"
                  }`}
                />
                <CloseIcon
                  className={`w-6 h-6 absolute transition-all duration-300 ${
                    isMobileMenuOpen
                      ? "opacity-100 rotate-0"
                      : "opacity-0 -rotate-180"
                  }`}
                />
              </div>
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-border animate-slide-down">
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item.href);
                  }}
                  className={`transition-all duration-300 ease-in-out font-medium py-2 ${
                    activeSection === item.id
                      ? "text-primary border-l-2 border-primary pl-2"
                      : "text-secondary hover:text-primary border-l-2 border-transparent pl-2"
                  }`}
                >
                  {t(`navigation.${item.id}`, { ns: "home" })}
                </a>
              ))}
              <div className="pt-4 border-t border-border">
                <LanguageSwitcher />
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
