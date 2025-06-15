import { useTranslation } from "react-i18next";
import { FloatingShapes } from "@/presentation/components/common/FloatingShapes/FloatingShapes";
import { floatingShapesConfig } from "../utils/floatingShapes";
import Image from "next/image";
import measuraHome from "@/presentation/assets/images/measura-home.png";
import { Button } from "@/presentation/components/primitives";
import { ArrowRightIcon } from "@/presentation/assets/icons";

export const HeroSection: React.FC = () => {
  const { t } = useTranslation(["common", "home"]);

  return (
    <section
      id="home"
      className="relative bg-background pt-36 pb-16 px-4 min-h-[100dvh] flex items-center justify-center overflow-x-hidden"
    >
      <div className="absolute inset-0 min-w-[1200px] h-full">
        <FloatingShapes shapes={floatingShapesConfig} containerOpacity={1} />
      </div>

      <div className="max-w-6xl mx-auto text-center relative z-10">
        <h1 className="text-3xl md:text-4xl font-bold text-violet-600 tracking-tight mb-6">
          {t("hero.title", { ns: "home" })}
        </h1>

        <p className="text-lg md:text-lg lg:text-xl text-secondary font-light-semibold mb-6 max-w-[60rem]">
          {t("heroSubtitle")}
        </p>
        <div className="flex gap-2 justify-center mb-6">
          <Button size="lg" className="px-8 py-3 flex items-center gap-2 group">
            {t("hero.getStarted", { ns: "home" })}
            <ArrowRightIcon className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Button>
          <Button
            variant="secondary"
            size="lg"
            className="px-8 py-3 flex items-center border-2 gap-2 group border-violet-500 text-violet-600 hover:bg-violet-50"
          >
            {t("hero.getStarted", { ns: "home" })}
            <ArrowRightIcon className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Button>
        </div>

        <div className="relative mb-16">
          <div className="relative bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-md rounded-3xl border border-white/30 p-6 shadow-2xl max-w-4xl mx-auto z-10">
            <div className="absolute top-4 left-4 flex gap-2">
              <div className="w-3 h-3 bg-red-400 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            </div>

            <div className="mt-6">
              <Image
                src={measuraHome}
                alt={t("hero.imageAlt", { ns: "home" })}
                className="w-full h-auto rounded-xl shadow-lg"
                quality={100}
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
