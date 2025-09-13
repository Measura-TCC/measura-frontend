interface ArrowLeftIconProps {
  className?: string;
}

export const ArrowLeftIcon: React.FC<ArrowLeftIconProps> = ({
  className = "w-5 h-5",
}) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M11 17l-5-5m0 0l5-5m-5 5h12"
    />
  </svg>
);