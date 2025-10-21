import { useTranslation } from "react-i18next";

interface MetricStatusBadgeProps {
  status: 'OK' | 'NEEDS_ATTENTION';
  size?: 'sm' | 'md' | 'lg';
}

export const MetricStatusBadge: React.FC<MetricStatusBadgeProps> = ({ status, size = 'md' }) => {
  const { t } = useTranslation("plans");
  const isOk = status === 'OK';

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-3 py-1",
    lg: "text-base px-4 py-2",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-medium ${
        isOk
          ? "bg-green-100 text-green-800"
          : "bg-yellow-100 text-yellow-800"
      } ${sizeClasses[size]}`}
    >
      {isOk ? '✓' : '⚠'} {t(isOk ? 'indicatorStatus.ok' : 'indicatorStatus.needsAttention')}
    </span>
  );
};
