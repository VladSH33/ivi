import React from "react";
import { Skeleton } from "../Skeleton/Skeleton";
import classes from "./MovieCardSkeleton.module.scss";

interface MovieCardSkeletonProps {
  count?: number;
}

export const MovieCardSkeleton: React.FC<MovieCardSkeletonProps> = ({
  count = 1,
}) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div className={classes.movieCardSkeleton} key={index}>
          <Skeleton
            width="100%"
            height="0"
            style={{ paddingBottom: "150%" }}
            className={classes.poster}
          />
        </div>
      ))}
    </>
  );
};
