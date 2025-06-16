import { useTranslation } from "react-i18next";
import {
  Button,
  Card,
  CardContent,
} from "@/presentation/components/primitives";
import {
  EmojiHappyIcon,
  UserIcon,
  CheckIcon,
  LockClosedIcon,
  LightningBoltIcon,
} from "@/presentation/assets/icons";

interface CTASectionProps {
  isLoading: boolean;
  error: string;
  onQuickLogin: () => void;
  onGetStarted: () => void;
  onClearError: () => void;
}

export const CTASection: React.FC<CTASectionProps> = ({
  isLoading,
  error,
  onQuickLogin,
  onGetStarted,
  onClearError,
}) => {
  const { t } = useTranslation(["common", "home"]);

  return (
    <section className="py-20 px-4 bg-gray-50 relative overflow-hidden">
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <div className="animate-slide-up mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-default mb-2">
            {t("cta.title", { ns: "home" })}
          </h2>
          <p className="text-secondary text-center max-w-xl mx-auto mb-8 text-base">
            {t("cta.subtitle", { ns: "home" })}
          </p>
        </div>

        <Card className="bg-white border border-border rounded-xl shadow-sm overflow-hidden">
          <CardContent className="py-10 px-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg animate-slide-up">
                <p className="text-red-600 text-sm">{error}</p>
                <button
                  onClick={onClearError}
                  className="text-red-600 hover:text-red-800 text-sm underline mt-1"
                >
                  {t("dismiss")}
                </button>
              </div>
            )}

            <div className="space-y-6">
              <div className="flex justify-center items-center gap-6 flex-wrap">
                <Button
                  onClick={onQuickLogin}
                  className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 text-sm shadow-sm transition-all duration-300"
                  disabled={isLoading}
                >
                  <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">
                    <EmojiHappyIcon className="w-3 h-3" />
                  </div>
                  {t("cta.tryDemo", { ns: "home" })}
                </Button>

                <span className="text-sm text-muted-foreground">
                  {t("cta.or", { ns: "home" })}
                </span>

                <Button
                  onClick={onGetStarted}
                  variant="ghost"
                  className="border border-violet-500 text-violet-600 hover:bg-violet-50 px-6 py-3 rounded-lg font-medium flex items-center gap-2 text-sm transition-all duration-300"
                  disabled={isLoading}
                >
                  <div className="w-5 h-5 bg-violet-100 rounded-full flex items-center justify-center">
                    <UserIcon className="w-3 h-3 text-violet-600" />
                  </div>
                  {t("cta.accessPlatform", { ns: "home" })}
                </Button>
              </div>

              <div className="flex justify-center flex-wrap gap-6 text-sm text-muted-foreground mt-6">
                <div className="flex items-center gap-2">
                  <CheckIcon className="w-4 h-4 text-green-500" />
                  {t("cta.features.instantAccess", { ns: "home" })}
                </div>
                <div className="flex items-center gap-2">
                  <LockClosedIcon className="w-4 h-4 text-blue-500" />
                  {t("cta.features.secureData", { ns: "home" })}
                </div>
                <div className="flex items-center gap-2">
                  <LightningBoltIcon className="w-4 h-4 text-violet-500" />
                  {t("cta.features.quickSetup", { ns: "home" })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-16">
          <div className="bg-gradient-to-r from-violet-500 to-violet-700 rounded-xl py-12 px-6 text-white relative overflow-hidden">
            <div className="absolute top-8 left-8 w-12 h-12 bg-white/10 rounded-full animate-float"></div>
            <div className="absolute bottom-8 right-12 w-8 h-8 bg-white/15 rounded-full animate-float animation-delay-1000"></div>
            <div className="absolute top-12 right-20 w-6 h-6 bg-white/20 rounded-full animate-float animation-delay-2000"></div>
            <div className="absolute bottom-16 left-20 w-4 h-4 bg-white/25 rounded-full animate-float animation-delay-3000"></div>

            <div className="text-center relative z-10">
              <h3 className="text-2xl md:text-3xl font-bold mb-2">
                {t("cta.newsletter.title", { ns: "home" })}
              </h3>
              <p className="text-sm md:text-base text-white/90 mb-8 max-w-2xl mx-auto">
                {t("cta.newsletter.description", { ns: "home" })}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
                <input
                  type="email"
                  placeholder={t("cta.newsletter.emailPlaceholder", {
                    ns: "home",
                  })}
                  className="flex-1 px-6 py-3 h-12 rounded-lg text-gray-900 placeholder-gray-500 border-0 focus:ring-2 focus:ring-white/50 outline-none"
                />
                <Button className="h-12 px-6 bg-white text-violet-600 hover:bg-gray-50 font-semibold rounded-lg shadow-lg transition-all duration-300">
                  {t("cta.newsletter.subscribe", { ns: "home" })}
                </Button>
              </div>

              <p className="text-sm text-white/70 mt-4">
                {t("cta.newsletter.terms", { ns: "home" })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
