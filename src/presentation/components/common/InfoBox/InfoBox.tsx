interface InfoBoxProps {
  children: React.ReactNode;
  variant?: "default" | "accent" | "muted";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const InfoBox: React.FC<InfoBoxProps> = ({
  children,
  variant = "default",
  size = "md",
  className = "",
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case "accent":
        return "bg-primary/10 border-primary/20 text-primary";
      case "muted":
        return "bg-white/15 border-white/25 text-muted";
      default:
        return "bg-white/20 border-white/30 text-secondary";
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "px-2 py-1 text-xs";
      case "lg":
        return "px-4 py-2 text-base";
      default:
        return "px-3 py-1.5 text-sm";
    }
  };

  return (
    <div
      className={`
        inline-flex items-center gap-2 
        backdrop-blur-sm rounded-full border 
        font-medium shadow-sm transition-all duration-300
        hover:bg-opacity-80 hover:shadow-md
        ${getVariantClasses()} 
        ${getSizeClasses()} 
        ${className}
      `}
    >
      {children}
    </div>
  );
};
