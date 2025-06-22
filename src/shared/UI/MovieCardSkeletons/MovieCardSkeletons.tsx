import React from "react";
import { MovieCardSkeleton } from "../MovieCardSkeleton/MovieCardSkeleton";
import classes from "./MovieCardSkeletons.module.scss";

type MovieCardSkeletonsProps = {
  count: number;
};

export const MovieCardSkeletons: React.FC<MovieCardSkeletonsProps> = ({
  count,
}) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div className={classes.slide} key={`skeleton-${index}`}>
          <MovieCardSkeleton count={1} />
        </div>
      ))}
    </>
  );
};
