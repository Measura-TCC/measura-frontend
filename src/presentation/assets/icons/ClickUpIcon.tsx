interface IconProps {
  className?: string;
}

export const ClickUpIcon = ({ className = "w-5 h-5" }: IconProps) => {
  return (
    <svg className={className} viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="clickUpChevronGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FF4A9F" stopOpacity="1" />
          <stop offset="20%" stopColor="#FF5E8D" stopOpacity="1" />
          <stop offset="40%" stopColor="#FF7A7A" stopOpacity="1" />
          <stop offset="60%" stopColor="#FF9668" stopOpacity="1" />
          <stop offset="80%" stopColor="#FFB255" stopOpacity="1" />
          <stop offset="100%" stopColor="#FFCE42" stopOpacity="1" />
        </linearGradient>
        <linearGradient id="clickUpArcGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8B5CF6" stopOpacity="1" />
          <stop offset="20%" stopColor="#8B7CF7" stopOpacity="1" />
          <stop offset="40%" stopColor="#8B9CF8" stopOpacity="1" />
          <stop offset="60%" stopColor="#7BC8FA" stopOpacity="1" />
          <stop offset="80%" stopColor="#6BD5FC" stopOpacity="1" />
          <stop offset="100%" stopColor="#5BE2FE" stopOpacity="1" />
        </linearGradient>
      </defs>
      <path d="M 50 180 L 160 70 Q 200 30 240 70 L 350 180 L 280 180 L 200 100 L 120 180 Z" fill="url(#clickUpChevronGradient)" stroke="none" />
      <path d="M 50 260 Q 200 360 350 260 L 350 320 Q 200 420 50 320 Z" fill="url(#clickUpArcGradient)" stroke="none" />
    </svg>
  );
};
