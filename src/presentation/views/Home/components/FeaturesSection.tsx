import { useTranslation } from "react-i18next";
import { featuresData } from "../utils/features";

export const FeaturesSection: React.FC = () => {
  const { t } = useTranslation("common");

  return (
    <section id="features" className="py-20 px-4 bg-background-secondary">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-violet-600">
            {t("featuresTitle")}
          </h2>
          <p className="text-lg text-secondary max-w-2xl mx-auto">
            {t("featuresDescription")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuresData.map(({ key, icon }) => (
            <div
              key={key}
              className="bg-background rounded-2xl p-8 shadow-md border border-border transition-colors duration-200"
            >
              <div className="flex flex-col items-center text-center gap-5">
                <div className="w-16 h-16 bg-background-accent rounded-2xl flex items-center justify-center text-violet-600 drop-shadow-sm">
                  {icon}
                </div>

                <h3 className="text-xl font-bold text-default">
                  {t(`features.${key}.title`)}
                </h3>

                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t(`features.${key}.description`)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
