export interface BenefitItem {
  key: string;
  gradient: string;
  iconGradient: string;
}

export const benefitsData: BenefitItem[] = [
  {
    key: "accurateEstimation",
    gradient: "from-purple-500 via-blue-500 to-indigo-600",
    iconGradient: "from-purple-400 to-purple-600",
  },
  {
    key: "timeEfficiency",
    gradient: "from-blue-500 via-indigo-500 to-purple-600",
    iconGradient: "from-blue-400 to-blue-600",
  },
  {
    key: "dataInsights",
    gradient: "from-indigo-500 via-purple-500 to-violet-600",
    iconGradient: "from-indigo-400 to-indigo-600",
  },
  {
    key: "teamCollaboration",
    gradient: "from-violet-500 via-purple-500 to-blue-600",
    iconGradient: "from-violet-400 to-violet-600",
  },
];
