import { UserRole } from '@/core/types';
import { HomeIcon, ChartIcon, TargetIcon, DocumentIcon, BookIcon } from '@/presentation/assets/icons';

export interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  requiredRoles?: UserRole[];
}

export const getNavigationItems = (t: (key: string) => string): NavigationItem[] => [
  {
    name: t('nav.dashboard'),
    href: '/dashboard',
    icon: HomeIcon,
    requiredRoles: [UserRole.USER, UserRole.ANALYST, UserRole.MANAGER, UserRole.ADMIN],
  },
  {
    name: t('nav.gqm'),
    href: '/gqm',
    icon: TargetIcon,
    requiredRoles: [UserRole.ANALYST, UserRole.MANAGER, UserRole.ADMIN],
  },
  {
    name: t('nav.fpa'),
    href: '/fpa',
    icon: ChartIcon,
    requiredRoles: [UserRole.ANALYST, UserRole.MANAGER, UserRole.ADMIN],
  },
  {
    name: t('nav.plans'),
    href: '/plans',
    icon: DocumentIcon,
    requiredRoles: [UserRole.MANAGER, UserRole.ADMIN],
  },
  {
    name: t('nav.docs'),
    href: '/docs',
    icon: BookIcon,
    requiredRoles: [UserRole.USER, UserRole.ANALYST, UserRole.MANAGER, UserRole.ADMIN],
  },
];

export const getFilteredNavigation = (userRole?: UserRole, t?: (key: string) => string): NavigationItem[] => {
  if (!t) {
    // Fallback navigation without translations
    return [
      { name: 'Dashboard', href: '/dashboard', icon: HomeIcon, requiredRoles: [UserRole.USER, UserRole.ANALYST, UserRole.MANAGER, UserRole.ADMIN] },
      { name: 'GQM', href: '/gqm', icon: TargetIcon, requiredRoles: [UserRole.ANALYST, UserRole.MANAGER, UserRole.ADMIN] },
      { name: 'FPA', href: '/fpa', icon: ChartIcon, requiredRoles: [UserRole.ANALYST, UserRole.MANAGER, UserRole.ADMIN] },
      { name: 'Plans', href: '/plans', icon: DocumentIcon, requiredRoles: [UserRole.MANAGER, UserRole.ADMIN] },
      { name: 'Docs', href: '/docs', icon: BookIcon, requiredRoles: [UserRole.USER, UserRole.ANALYST, UserRole.MANAGER, UserRole.ADMIN] },
    ];
  }

  const navigationItems = getNavigationItems(t);
  
  if (!userRole) return navigationItems;
  
  return navigationItems.filter(item => 
    !item.requiredRoles || item.requiredRoles.includes(userRole)
  );
};

export const getNavigationByHref = (href: string, t?: (key: string) => string): NavigationItem | undefined => {
  if (!t) return undefined;
  return getNavigationItems(t).find(item => item.href === href);
};

export const isActiveNavigation = (pathname: string, href: string): boolean => {
  if (href === '/dashboard') {
    return pathname === '/dashboard';
  }
  
  return pathname.startsWith(href);
}; 