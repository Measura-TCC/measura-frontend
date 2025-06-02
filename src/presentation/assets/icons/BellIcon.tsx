interface IconProps {
  className?: string;
}

export const BellIcon = ({ className = "w-5 h-5" }: IconProps) => {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM11 20.414l1.121-1.121M12 9.858V4.242A2.243 2.243 0 009.758 2H2.242A2.243 2.243 0 000 4.242v5.616a2.243 2.243 0 002.242 2.242h7.516z" />
    </svg>
  );
}; 