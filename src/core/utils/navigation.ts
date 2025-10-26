import { UserRole } from "@/core/types";
import {
  HomeIcon,
  ChartIcon,
  DocumentIcon,
  BuildingIcon,
  UserIcon,
} from "@/presentation/assets/icons";

export interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  requiredRoles?: UserRole[];
  badge?: number;
  disabled?: boolean;
}

export const getNavigationItems = (
  t: (key: string) => string
): NavigationItem[] => [
  {
    name: t("nav.overview"),
    href: "/overview",
    icon: HomeIcon,
    requiredRoles: [
      UserRole.USER,
      UserRole.ANALYST,
      UserRole.MANAGER,
      UserRole.ADMIN,
    ],
  },
  {
    name: t("nav.organization"),
    href: "/organization",
    icon: BuildingIcon,
    requiredRoles: [
      UserRole.USER,
      UserRole.ANALYST,
      UserRole.MANAGER,
      UserRole.ADMIN,
    ],
  },
  {
    name: t("nav.projects"),
    href: "/projects",
    icon: DocumentIcon,
    requiredRoles: [
      UserRole.USER,
      UserRole.ANALYST,
      UserRole.MANAGER,
      UserRole.ADMIN,
    ],
  },
  {
    name: t("nav.fpa"),
    href: "/fpa",
    icon: ChartIcon,
    requiredRoles: [
      UserRole.USER,
      UserRole.ANALYST,
      UserRole.MANAGER,
      UserRole.ADMIN,
    ],
  },
  {
    name: t("nav.plans"),
    href: "/plans",
    icon: DocumentIcon,
    requiredRoles: [
      UserRole.USER,
      UserRole.ANALYST,
      UserRole.MANAGER,
      UserRole.ADMIN,
    ],
  },
  {
    name: t("nav.account"),
    href: "/account",
    icon: UserIcon,
    requiredRoles: [
      UserRole.USER,
      UserRole.ANALYST,
      UserRole.MANAGER,
      UserRole.ADMIN,
    ],
  },
];

export const getFilteredNavigation = (
  userRole?: UserRole,
  t?: (key: string) => string
): NavigationItem[] => {
  if (!t) {
    return [
      {
        name: "Overview",
        href: "/overview",
        icon: HomeIcon,
        requiredRoles: [
          UserRole.USER,
          UserRole.ANALYST,
          UserRole.MANAGER,
          UserRole.ADMIN,
        ],
      },
      {
        name: "Organization",
        href: "/organization",
        icon: BuildingIcon,
        requiredRoles: [
          UserRole.USER,
          UserRole.ANALYST,
          UserRole.MANAGER,
          UserRole.ADMIN,
        ],
      },
      {
        name: "Projects",
        href: "/projects",
        icon: DocumentIcon,
        requiredRoles: [
          UserRole.USER,
          UserRole.ANALYST,
          UserRole.MANAGER,
          UserRole.ADMIN,
        ],
      },
      {
        name: "FPA",
        href: "/fpa",
        icon: ChartIcon,
        requiredRoles: [
          UserRole.USER,
          UserRole.ANALYST,
          UserRole.MANAGER,
          UserRole.ADMIN,
        ],
      },
      {
        name: "Plans",
        href: "/plans",
        icon: DocumentIcon,
        requiredRoles: [
          UserRole.USER,
          UserRole.ANALYST,
          UserRole.MANAGER,
          UserRole.ADMIN,
        ],
      },
      {
        name: "Account",
        href: "/account",
        icon: UserIcon,
        requiredRoles: [
          UserRole.USER,
          UserRole.ANALYST,
          UserRole.MANAGER,
          UserRole.ADMIN,
        ],
      },
    ];
  }

  const navigationItems = getNavigationItems(t);

  if (!userRole) return navigationItems;

  return navigationItems.filter(
    (item) => !item.requiredRoles || item.requiredRoles.includes(userRole)
  );
};

export const getNavigationByHref = (
  href: string,
  t?: (key: string) => string
): NavigationItem | undefined => {
  if (!t) return undefined;
  return getNavigationItems(t).find((item) => item.href === href);
};

export const isActiveNavigation = (pathname: string, href: string): boolean => {
  const normalizedPathname = pathname.replace(/\/$/, "") || "/";
  const normalizedHref = href.replace(/\/$/, "") || "/";

  if (normalizedHref === "/overview") {
    return normalizedPathname === "/overview";
  }

  return normalizedPathname.startsWith(normalizedHref);
};
