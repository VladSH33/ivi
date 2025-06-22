import React from "react";
import classes from "./Skeleton.module.scss";

interface SkeletonProps {
  count?: number;
  width?: string | number;
  height?: string | number;
  borderRadius?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  count = 1,
  width = "100%",
  height = "1rem",
  borderRadius = "1.8rem",
  className = "",
  style = {},
}) => {
  const skeletons = Array.from({ length: count }).map((_, index) => (
    <div
      key={index}
      className={`${classes.skeleton} ${className}`}
      style={{
        width,
        height,
        borderRadius,
        ...style,
      }}
    />
  ));

  return <>{skeletons}</>;
};
