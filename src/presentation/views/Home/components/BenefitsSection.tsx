import { useTranslation } from "react-i18next";
import { benefitsData } from "../utils/benefits";

export const BenefitsSection: React.FC = () => {
  const { t } = useTranslation("common");

  return (
    <section
      id="benefits"
      className="py-20 px-4 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-purple-950 dark:via-blue-950 dark:to-indigo-900 relative overflow-hidden"
    >
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-purple-500/5 via-blue-500/5 to-indigo-500/5"></div>
        <div className="absolute top-32 left-32 w-64 h-64 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
        <div className="absolute bottom-32 right-32 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float animation-delay-2000"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-violet-600">
              {t("whyChooseMeasura")}
            </span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            {t("benefitsDescription")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {benefitsData.map(({ key, gradient, iconGradient }) => (
            <div
              key={key}
              className="group relative overflow-hidden rounded-3xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border border-purple-200 dark:border-purple-800"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-500`}
              ></div>
              <div className="absolute top-4 right-4">
                <div
                  className={`w-12 h-12 bg-gradient-to-r ${iconGradient} rounded-full opacity-20 group-hover:opacity-30 transition-all duration-500 group-hover:scale-110`}
                ></div>
              </div>
              <div className="relative z-10">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
                  {t(`benefits.${key}.title`)}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-left">
                  {t(`benefits.${key}.description`)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
