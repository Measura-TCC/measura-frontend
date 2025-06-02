"use client";

import { useState, useRef, useEffect, ReactNode } from "react";
import { cn } from "@/core/utils";

export interface DropdownItem {
  id: string;
  label: ReactNode;
  onClick?: () => void;
}

export interface DropdownProps {
  trigger: ReactNode;
  items: DropdownItem[];
  align?: "left" | "right";
  className?: string;
  dropdownClassName?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  items,
  align = "left",
  className,
  dropdownClassName,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const closeDropdown = () => {
    setIsOpen(false);
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

  return (
    <div
      className={cn("relative inline-block text-left", className)}
      ref={dropdownRef}
    >
      <div onClick={toggleDropdown}>{trigger}</div>
      {isOpen && (
        <div
          className={cn(
            "absolute z-10 mt-2 w-56 origin-top-right rounded-md shadow-lg",
            "bg-background border border-border focus:outline-none",
            align === "right" ? "right-0" : "left-0",
            dropdownClassName
          )}
        >
          <div className="py-1">
            {items.map((item) => (
              <div
                key={item.id}
                className={cn(
                  "block px-4 py-2 text-sm cursor-pointer",
                  "text-secondary hover:bg-background-secondary hover:text-default hover:cursor-pointer",
                  "transition-colors"
                )}
                onClick={() => {
                  if (item.onClick) {
                    item.onClick();
                  }
                  closeDropdown();
                }}
              >
                {item.label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
 