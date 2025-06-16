import { useTranslation } from "react-i18next";
import { TeamCard } from "./TeamCard";
import { teamMembers } from "../utils/team";

export const TeamSection: React.FC = () => {
  const { t } = useTranslation(["common", "home"]);

  return (
    <section id="team" className="py-20 px-4 bg-background-secondary">
      <div className="max-w-6xl mx-auto text-center">
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-violet-600">
            {t("team.title", { ns: "home" })}
          </h2>
          <p className="text-lg text-secondary max-w-2xl mx-auto">
            {t("team.description", { ns: "home" })}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {teamMembers.map((member) => (
            <div key={member.id}>
              <TeamCard member={member} />
            </div>
          ))}
        </div>

        <div className="mt-16">
          <div className="bg-gradient-to-r from-violet-500 to-violet-700 rounded-xl py-12 px-6 text-white relative overflow-hidden">
            <div className="absolute top-8 left-8 w-12 h-12 bg-white/10 rounded-full animate-float"></div>
            <div className="absolute bottom-8 right-12 w-8 h-8 bg-white/15 rounded-full animate-float animation-delay-1000"></div>
            <div className="absolute top-12 right-20 w-6 h-6 bg-white/20 rounded-full animate-float animation-delay-2000"></div>
            <div className="absolute bottom-16 left-20 w-4 h-4 bg-white/25 rounded-full animate-float animation-delay-3000"></div>

            <div className="text-center relative z-10">
              <h3 className="text-2xl md:text-3xl font-bold mb-2">
                {t("team.joinCommunity", { ns: "home" })}
              </h3>
              <p className="text-sm md:text-base text-white/90 mb-8 max-w-2xl mx-auto">
                {t("team.communityDescription", { ns: "home" })}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a
                  href="https://github.com/joaovictorferreira/measura-frontend"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white text-violet-600 hover:bg-gray-50 font-semibold px-6 py-3 rounded-lg shadow-lg transition-all duration-300"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.237 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  {t("team.viewOnGithub", { ns: "home" })}
                </a>
              </div>

              <p className="text-sm text-white/70 mt-6">
                {t("team.projectFooter", { ns: "home" })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
