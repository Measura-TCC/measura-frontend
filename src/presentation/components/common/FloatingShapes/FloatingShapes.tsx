export interface FloatingShapeProps {
  size?: "sm" | "md" | "lg" | "xl";
  shape?: "square" | "circle" | "diamond" | "triangle" | "hexagon" | "star";
  position: {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
  };
  animationDelay?: number;
  opacity?: number;
  borderWidth?: 1 | 2 | 3 | 4;
}

export interface FloatingShapesProps {
  shapes: FloatingShapeProps[];
  containerOpacity?: number;
}

const getSizeClasses = (size: FloatingShapeProps["size"]) => {
  switch (size) {
    case "sm":
      return "w-12 h-12";
    case "md":
      return "w-16 h-16";
    case "lg":
      return "w-24 h-24";
    case "xl":
      return "w-32 h-32";
    default:
      return "w-16 h-16";
  }
};

const getShapeClasses = (shape: FloatingShapeProps["shape"]) => {
  switch (shape) {
    case "circle":
      return "rounded-full";
    case "diamond":
      return "rotate-45";
    case "triangle":
      return "triangle-shape";
    case "hexagon":
      return "hexagon-shape";
    case "star":
      return "star-shape";
    case "square":
    default:
      return "rounded-lg";
  }
};

const getPositionClasses = () => {
  return "absolute";
};

const getPositionStyles = (position: FloatingShapeProps["position"]) => {
  const styles: React.CSSProperties = {};

  // Convert fraction strings to percentages relative to container
  const convertFraction = (fraction: string) => {
    if (fraction.includes("/")) {
      const [numerator, denominator] = fraction.split("/").map(Number);
      return `${(numerator / denominator) * 100}%`;
    }
    return fraction;
  };

  if (position.top) styles.top = convertFraction(position.top);
  if (position.bottom) styles.bottom = convertFraction(position.bottom);
  if (position.left) styles.left = convertFraction(position.left);
  if (position.right) styles.right = convertFraction(position.right);

  return styles;
};

const getBorderClasses = (borderWidth: FloatingShapeProps["borderWidth"]) => {
  switch (borderWidth) {
    case 1:
      return "border";
    case 2:
      return "border-2";
    case 3:
      return "border-[3px]";
    case 4:
      return "border-[4px]";
    default:
      return "border-2";
  }
};

const FloatingShape: React.FC<FloatingShapeProps> = ({
  size = "md",
  shape = "square",
  position,
  animationDelay = 0,
  opacity = 0.05,
  borderWidth = 2,
}) => {
  const sizeClasses = getSizeClasses(size);
  const shapeClasses = getShapeClasses(shape);
  const positionClasses = getPositionClasses();
  const positionStyles = getPositionStyles(position);
  const borderClasses = getBorderClasses(borderWidth);
  const delayClass =
    animationDelay > 0 ? `animation-delay-${animationDelay}` : "";

  // For origami shapes, we need to apply opacity via CSS custom property
  const isOrigamiShape = ["triangle", "hexagon", "star"].includes(shape || "");
  const finalBorderClasses = isOrigamiShape
    ? ""
    : `${borderClasses} border-primary`;
  const finalSizeClasses = shape === "triangle" ? sizeClasses : sizeClasses;

  const shapeStyle = isOrigamiShape
    ? ({
        "--shape-opacity": opacity,
        opacity: 1,
        ...positionStyles,
      } as React.CSSProperties & { "--shape-opacity": number })
    : { opacity, ...positionStyles };

  return (
    <div
      className={`${positionClasses} ${finalSizeClasses} ${finalBorderClasses} ${shapeClasses}  animate-float ${delayClass}`}
      style={shapeStyle}
    />
  );
};

export const FloatingShapes: React.FC<FloatingShapesProps> = ({
  shapes,
  containerOpacity = 1,
}) => {
  return (
    <div className="absolute inset-0" style={{ opacity: containerOpacity }}>
      {shapes.map((shape, index) => (
        <FloatingShape key={index} {...shape} />
      ))}
    </div>
  );
};
