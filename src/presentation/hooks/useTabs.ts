import { useState, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export interface UseTabsOptions<T extends string> {
  defaultTab: T;
  syncWithUrl?: {
    paramName?: string;
    scroll?: boolean;
  };
}

export interface UseTabsReturn<T extends string> {
  activeTab: T;
  setActiveTab: (tab: T) => void;
  isActive: (tab: T) => boolean;
}

export function useTabs<T extends string>(
  options: UseTabsOptions<T>
): UseTabsReturn<T> {
  const { defaultTab, syncWithUrl } = options;
  const router = useRouter();
  const searchParams = useSearchParams();

  const getInitialTab = useCallback((): T => {
    if (syncWithUrl && searchParams) {
      const paramName = syncWithUrl.paramName || "tab";
      const tabFromUrl = searchParams.get(paramName);
      if (tabFromUrl) {
        return tabFromUrl as T;
      }
    }
    return defaultTab;
  }, [defaultTab, syncWithUrl, searchParams]);

  const [activeTab, setActiveTabState] = useState<T>(getInitialTab);

  useEffect(() => {
    if (syncWithUrl && searchParams) {
      const paramName = syncWithUrl.paramName || "tab";
      const tabFromUrl = searchParams.get(paramName);
      if (tabFromUrl && tabFromUrl !== activeTab) {
        setActiveTabState(tabFromUrl as T);
      }
    }
  }, [searchParams, syncWithUrl, activeTab]);

  const setActiveTab = useCallback(
    (tab: T) => {
      setActiveTabState(tab);

      if (syncWithUrl && router) {
        const paramName = syncWithUrl.paramName || "tab";
        const scroll = syncWithUrl.scroll ?? false;
        router.push(`?${paramName}=${tab}`, { scroll });
      }
    },
    [router, syncWithUrl]
  );

  const isActive = useCallback((tab: T) => activeTab === tab, [activeTab]);

  return {
    activeTab,
    setActiveTab,
    isActive,
  };
}
