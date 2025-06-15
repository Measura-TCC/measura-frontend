type FeatureCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

export const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
}) => (
  <div className=" backdrop-blur-md border border-white/20 rounded-xl p-6 md:p-8">
    <div className="flex flex-col items-start">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 text-primary mb-4">{icon}</div>
        <h3 className="text-base font-semibold text-primary mb-2">{title}</h3>
      </div>

      <p className="text-sm md:text-base  text-left text-default/80 leading-relaxed">
        {description}
      </p>
    </div>
  </div>
);
