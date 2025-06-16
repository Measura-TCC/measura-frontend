interface DashboardSectionProps {
  children: React.ReactNode;
}

export const DashboardSection: React.FC<DashboardSectionProps> = ({
  children,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {children}
    </div>
  );
};
