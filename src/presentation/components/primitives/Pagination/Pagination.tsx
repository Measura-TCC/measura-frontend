import { useTranslation } from "react-i18next";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPreviousPage: () => void;
  onNextPage: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
  maxVisiblePages?: number;
  showText?: boolean;
  startIndex?: number;
  endIndex?: number;
  totalItems?: number;
}

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  onPreviousPage,
  onNextPage,
  canGoPrevious,
  canGoNext,
  maxVisiblePages = 5,
  showText = true,
  startIndex,
  endIndex,
  totalItems,
}: PaginationProps) => {
  const { t } = useTranslation("fpa");

  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    if (totalPages <= maxVisiblePages) {
      return pages;
    }

    const visiblePages: (number | string)[] = [];
    if (currentPage <= 3) {
      visiblePages.push(1, 2, 3, 4, '...', totalPages);
    } else if (currentPage >= totalPages - 2) {
      visiblePages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      visiblePages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
    }

    return visiblePages;
  };

  return (
    <div className="bg-gray-50 px-3 sm:px-6 py-3 border-t flex flex-col sm:flex-row items-center justify-between gap-3">
      {showText && startIndex !== undefined && endIndex !== undefined && totalItems !== undefined && (
        <div className="text-xs sm:text-sm text-gray-700 order-2 sm:order-1">
          {t("requirementClassification.showing", {
            start: startIndex + 1,
            end: Math.min(endIndex, totalItems),
            total: totalItems,
          })}
        </div>
      )}

      <div className={`flex gap-2 ${showText ? 'order-1 sm:order-2' : ''}`}>
        <button
          onClick={onPreviousPage}
          disabled={!canGoPrevious}
          className="px-2 sm:px-3 py-1.5 sm:py-1 border border-border rounded-md text-xs sm:text-sm font-medium text-default bg-background hover:bg-background-secondary disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer min-w-[44px] h-[44px] sm:h-auto flex items-center justify-center transition-colors"
          aria-label={t("requirementClassification.previousPage")}
        >
          <span className="hidden sm:inline">{t("requirementClassification.previous")}</span>
          <svg className="sm:hidden w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="flex gap-1">
          {getVisiblePages().map((page, idx) => {
            if (page === '...') {
              return (
                <span key={`ellipsis-${idx}`} className="px-2 sm:px-3 py-1.5 sm:py-1 text-xs sm:text-sm text-gray-500 flex items-center">
                  ...
                </span>
              );
            }
            return (
              <button
                key={page}
                onClick={() => onPageChange(page as number)}
                className={`px-2 sm:px-3 py-1.5 sm:py-1 border rounded-md text-xs sm:text-sm font-medium cursor-pointer min-w-[44px] h-[44px] sm:h-auto flex items-center justify-center transition-colors ${
                  currentPage === page
                    ? 'bg-primary text-white border-primary'
                    : 'bg-background text-default border-border hover:bg-background-secondary'
                }`}
              >
                {page}
              </button>
            );
          })}
        </div>

        <button
          onClick={onNextPage}
          disabled={!canGoNext}
          className="px-2 sm:px-3 py-1.5 sm:py-1 border border-border rounded-md text-xs sm:text-sm font-medium text-default bg-background hover:bg-background-secondary disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer min-w-[44px] h-[44px] sm:h-auto flex items-center justify-center transition-colors"
          aria-label={t("requirementClassification.nextPage")}
        >
          <span className="hidden sm:inline">{t("requirementClassification.next")}</span>
          <svg className="sm:hidden w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};
