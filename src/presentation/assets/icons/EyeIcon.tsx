interface EyeIconProps {
  className?: string;
  size?: number;
}

export const EyeIcon: React.FC<EyeIconProps> = ({
  className = "w-5 h-5",
  size,
}) => {
  const sizeClass = size ? `w-${size} h-${size}` : className;

  return (
    <svg
      className={sizeClass}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
      />
      <circle
        cx="12"
        cy="12"
        r="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
      />
    </svg>
  );
};
