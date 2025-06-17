import { useTranslation } from "react-i18next";
import Link from "next/link";

export const FooterSection: React.FC = () => {
  const { t } = useTranslation("common");
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold mb-4">Measura</h3>
            <p className="text-white/80 mb-4 max-w-md leading-relaxed">
              {t("footerDescription")}
            </p>
            <div className="text-sm text-white/70">
              {t("builtWith")} Next.js, React, TypeScript
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-white/90">{t("product")}</h4>
            <ul className="space-y-2 text-white/70">
              <li>
                <span className="hover:text-white cursor-pointer transition-colors duration-300">
                  {t("features.fpaEstimation.title")}
                </span>
              </li>
              <li>
                <span className="hover:text-white cursor-pointer transition-colors duration-300">
                  {t("features.measurementPlans.title")}
                </span>
              </li>
              <li>
                <span className="hover:text-white cursor-pointer transition-colors duration-300">
                  {t("features.projectTracking.title")}
                </span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-white/90">{t("company")}</h4>
            <ul className="space-y-2 text-white/70">
              <li>
                <span className="hover:text-white cursor-pointer transition-colors duration-300">
                  {t("about")}
                </span>
              </li>
              <li>
                <span className="hover:text-white cursor-pointer transition-colors duration-300">
                  {t("terms")}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-white/70 text-sm mb-4 md:mb-0">
              © {currentYear} Measura. {t("allRightsReserved")}
            </div>
            <div className="text-white/70 text-sm">
              <span className="mr-2">{t("developedBy", { ns: "home" })}:</span>
              <Link
                href="https://www.linkedin.com/in/joao-victor-eth/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/90 hover:text-white transition-colors duration-300 mr-2"
              >
                João Ferreira
              </Link>
              <span className="mx-1">•</span>
              <Link
                href="https://www.linkedin.com/in/lohine-mussi/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/90 hover:text-white transition-colors duration-300 mr-2"
              >
                Lohine Mussi
              </Link>
              <span className="mx-1">•</span>
              <Link
                href="https://www.linkedin.com/in/josemussy/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/90 hover:text-white transition-colors duration-300"
              >
                José Mussy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
