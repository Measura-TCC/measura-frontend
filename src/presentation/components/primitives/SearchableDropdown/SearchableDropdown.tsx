"use client";

import { useState, useRef, useEffect, ReactNode } from "react";
import { cn } from "@/core/utils";
import {
  SearchIcon,
  ChevronDownIcon,
  XIcon,
} from "@/presentation/assets/icons";

export interface SearchableDropdownItem {
  id: string;
  label: ReactNode;
  value: string;
  disabled?: boolean;
}

export interface SearchableDropdownProps {
  items: SearchableDropdownItem[];
  value?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  dropdownClassName?: string;
  onChange: (value: string | null) => void;
}

export const SearchableDropdown: React.FC<SearchableDropdownProps> = ({
  items,
  value,
  placeholder = "Select an option",
  searchPlaceholder = "Search...",
  emptyMessage = "No options found",
  disabled = false,
  loading = false,
  className,
  dropdownClassName,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectedItem = items.find((item) => item.value === value);

  const filteredItems = items.filter((item) =>
    item.label?.toString().toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleDropdown = () => {
    if (disabled || loading) return;
    setIsOpen(!isOpen);
    if (!isOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 0);
    }
  };

  const closeDropdown = () => {
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleSelect = (item: SearchableDropdownItem) => {
    if (item.disabled) return;
    onChange(item.value);
    closeDropdown();
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        closeDropdown();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      setSearchTerm("");
    }
  }, [isOpen]);

  return (
    <div className={cn("relative w-full", className)} ref={dropdownRef}>
      <div
        onClick={toggleDropdown}
        className={cn(
          "flex items-center justify-between w-full px-3 py-2 border rounded-md cursor-pointer transition-colors",
          "bg-background text-default border-border",
          "hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
          disabled && "opacity-50 cursor-not-allowed",
          loading && "cursor-wait",
          isOpen && "border-primary ring-2 ring-primary/20"
        )}
      >
        <span className={cn("text-xs sm:text-sm break-words", !selectedItem && "text-muted")}>
          {loading ? "Loading..." : selectedItem?.label || placeholder}
        </span>
        <div className="flex items-center gap-1">
          {selectedItem && !disabled && !loading && (
            <button
              onClick={handleClear}
              className="p-0.5 hover:bg-background-secondary rounded"
            >
              <XIcon className="w-3 h-3 text-muted" />
            </button>
          )}
          <ChevronDownIcon
            className={cn(
              "w-4 h-4 text-muted transition-transform",
              isOpen && "transform rotate-180"
            )}
          />
        </div>
      </div>

      {isOpen && (
        <div
          className={cn(
            "absolute z-50 w-full mt-1 bg-background border border-border rounded-md shadow-lg",
            "max-h-60 overflow-hidden",
            dropdownClassName
          )}
        >
          <div className="p-2 border-b border-border">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full !pl-8 pr-3 py-1.5 text-sm border border-border rounded bg-background text-default placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          <div className="max-h-48 overflow-y-auto">
            {filteredItems.length === 0 ? (
              <div className="px-3 py-2 text-sm text-muted text-center">
                {emptyMessage}
              </div>
            ) : (
              filteredItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  className={cn(
                    "px-3 py-2 text-xs sm:text-sm cursor-pointer transition-colors break-words",
                    "hover:bg-background-secondary",
                    item.disabled && "opacity-50 cursor-not-allowed",
                    item.value === value &&
                      "bg-primary/10 text-primary font-medium"
                  )}
                >
                  {item.label}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
