import { useTranslation } from "react-i18next";

interface MetricStatusBadgeProps {
  status: 'OK' | 'NEEDS_ATTENTION' | 'NO_DATA';
  size?: 'sm' | 'md' | 'lg';
}

export const MetricStatusBadge: React.FC<MetricStatusBadgeProps> = ({ status, size = 'md' }) => {
  const { t } = useTranslation("plans");

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-3 py-1",
    lg: "text-base px-4 py-2",
  };

  const getStatusConfig = () => {
    switch (status) {
      case 'OK':
        return {
          icon: '✓',
          bgColor: 'bg-green-100 dark:bg-green-900/20',
          textColor: 'text-green-800 dark:text-green-300',
          label: t('indicatorStatus.ok'),
        };
      case 'NEEDS_ATTENTION':
        return {
          icon: '⚠',
          bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
          textColor: 'text-yellow-800 dark:text-yellow-300',
          label: t('indicatorStatus.needsAttention'),
        };
      case 'NO_DATA':
        return {
          icon: '○',
          bgColor: 'bg-gray-100 dark:bg-gray-800',
          textColor: 'text-gray-600 dark:text-gray-400',
          label: t('indicatorStatus.noData'),
        };
    }
  };

  const config = getStatusConfig();

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-medium ${config.bgColor} ${config.textColor} ${sizeClasses[size]}`}
    >
      {config.icon} {config.label}
    </span>
  );
};
