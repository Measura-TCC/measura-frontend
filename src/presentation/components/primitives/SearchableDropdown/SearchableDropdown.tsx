"use client";

import { useEffect, useRef, useState, ReactNode } from "react";
import { SearchIcon } from "@/presentation/assets/icons";

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

export const SearchableDropdown = ({
  items,
  value,
  placeholder = "Select an option",
  searchPlaceholder = "Search...",
  emptyMessage = "No options found",
  disabled = false,
  loading = false,
  className = "",
  dropdownClassName = "",
  onChange,
}: SearchableDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectedItem = items.find((i) => i.value === value);
  const filtered = items.filter((i) =>
    (typeof i.label === "string" ? i.label : String(i.label))
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const toggle = () => {
    if (disabled || loading) return;
    setIsOpen((v) => !v);
    if (!isOpen) setTimeout(() => searchInputRef.current?.focus(), 0);
  };

  const close = () => {
    setIsOpen(false);
    setSearchTerm("");
  };

  const select = (item: SearchableDropdownItem) => {
    if (item.disabled) return;
    onChange(item.value);
    close();
  };

  const clear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
  };

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        close();
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  useEffect(() => {
    if (isOpen) setSearchTerm("");
  }, [isOpen]);

    // Inline icons to avoid adding new assets
  const Chevron = ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg viewBox="0 0 20 20" fill="currentColor" className={className} aria-hidden>
      <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.114l3.71-3.883a.75.75 0 111.08 1.04l-4.24 4.44a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" />
    </svg>
  );
  const X = ({ className = "w-3 h-3" }: { className?: string }) => (
    <svg viewBox="0 0 20 20" fill="currentColor" className={className} aria-hidden>
      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
  );

  return (
    <div className={`relative w-full ${className}`} ref={dropdownRef}>
      <div
        onClick={toggle}
        className={[
          "flex items-center justify-between w-full px-3 py-2 border rounded-md cursor-pointer transition-colors",
          "bg-background text-default border-border",
          "hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
          disabled ? "opacity-50 cursor-not-allowed" : "",
          loading ? "cursor-wait" : "",
          isOpen ? "border-primary ring-2 ring-primary/20" : "",
        ].join(" ")}
      >
        <span className={`text-sm ${!selectedItem ? "text-muted" : ""}`}>
          {loading ? "Loading..." : selectedItem?.label || placeholder}
        </span>
        <div className="flex items-center gap-1">
          {selectedItem && !disabled && !loading && (
            <button onClick={clear} className="p-0.5 hover:bg-background-secondary rounded">
              <X className="w-3 h-3 text-muted" />
            </button>
          )}
          <Chevron className={`w-4 h-4 text-muted transition-transform ${isOpen ? "transform rotate-180" : ""}`} />
        </div>
      </div>

      {isOpen && (
        <div
          className={[
            "absolute z-50 w-full mt-1 bg-background border border-border rounded-md shadow-lg",
            "max-h-60 overflow-hidden",
            dropdownClassName,
          ].join(" ")}
        >
          <div className="p-2 border-b border-border">
            <div className="relative">
              <SearchIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full pl-8 pr-3 py-1.5 text-sm border border-border rounded bg-background text-default placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
          <div className="max-h-48 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="px-3 py-2 text-sm text-muted text-center">{emptyMessage}</div>
            ) : (
              filtered.map((item) => (
                <div
                  key={item.id}
                  onClick={() => select(item)}
                  className={[
                    "px-3 py-2 text-sm cursor-pointer transition-colors",
                    "hover:bg-background-secondary",
                    item.disabled ? "opacity-50 cursor-not-allowed" : "",
                    item.value === value ? "bg-primary/10 text-primary font-medium" : "",
                  ].join(" ")}
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

