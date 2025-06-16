import {
  BarChartIcon,
  ClipboardIcon,
  TrendingUpIcon,
  UsersIcon,
  GearIcon,
} from "@/presentation/assets/icons";

export interface FeatureItem {
  key: string;
  icon: React.ReactElement;
}

export const featuresData: FeatureItem[] = [
  {
    key: "fpaEstimation",
    icon: <BarChartIcon className="w-10 h-10" />,
  },
  {
    key: "measurementPlans",
    icon: <ClipboardIcon className="w-10 h-10" />,
  },
  {
    key: "projectTracking",
    icon: <TrendingUpIcon className="w-10 h-10" />,
  },
  {
    key: "organizationManagement",
    icon: <UsersIcon className="w-10 h-10" />,
  },
  {
    key: "automation",
    icon: <GearIcon className="w-10 h-10" />,
  },
  {
    key: "collaboration",
    icon: <UsersIcon className="w-10 h-10" />,
  },
];
