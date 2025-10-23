import { useState, useMemo } from "react";

export interface UsePaginationProps<T> {
  data: T[];
  initialPage?: number;
  initialItemsPerPage?: number;
}

export interface UsePaginationReturn<T> {
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;
  paginatedData: T[];
  startIndex: number;
  endIndex: number;
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (items: number) => void;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
}

export function usePagination<T>({
  data,
  initialPage = 1,
  initialItemsPerPage = 10,
}: UsePaginationProps<T>): UsePaginationReturn<T> {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const paginatedData = useMemo(() => {
    return data.slice(startIndex, endIndex);
  }, [data, startIndex, endIndex]);

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const canGoNext = currentPage < totalPages;
  const canGoPrevious = currentPage > 1;

  // Reset to page 1 if current page exceeds total pages
  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(1);
  }

  return {
    currentPage,
    itemsPerPage,
    totalPages,
    paginatedData,
    startIndex,
    endIndex,
    setCurrentPage,
    setItemsPerPage: (items: number) => {
      setItemsPerPage(items);
      setCurrentPage(1); // Reset to first page when changing items per page
    },
    goToNextPage,
    goToPreviousPage,
    canGoNext,
    canGoPrevious,
  };
}
