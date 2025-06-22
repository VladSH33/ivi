import React, { useState, useRef, useEffect } from "react";
import classes from "./Movies.module.scss";

import { useGetPaginationMoviesQuery } from "@/entities/Movie";

import { Breadcrumbs } from "@/shared/UI/Breadcrumbs/UI/Breadcrumbs";

import { MovieCard } from "@/entities/Movie";
import { MovieFilters } from "@/features/MovieFilters/UI/MovieFilters";
import { MovieCardSkeleton } from "@/shared/UI/MovieCardSkeleton/MovieCardSkeleton";
import { Skeleton } from "@/shared/UI/Skeleton/Skeleton";

import { FilterType } from "@/entities/Filter";

export const Movies = () => {
  const [moviesList, setMoviesList] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFilters] = useState<FilterType>({});
  const [page, setPage] = useState(1);

  const {
    data: moviesData,
    isLoading,
    isFetching,
    error,
  } = useGetPaginationMoviesQuery(
    {
      page,
      limit: 14,
      filters: { ...filters },
    },
    { refetchOnMountOrArgChange: true }
  );

  useEffect(() => {
    if (Object.keys(filters).length > 0) {
      setPage(1);
      setMoviesList([]);
    }
  }, [filters]);

  useEffect(() => {
    if (moviesData) {
      setMoviesList((prev) =>
        page === 1 ? moviesData.data : [...prev, ...moviesData.data]
      );
      setTotalPages(moviesData.meta.totalPages);
    }
  }, [moviesData, page]);

  const formatFilterParameters = (): string => {
    const { genre, country, year } = filters;

    const formattedGenre = genre || "Все жанры";
    const formattedCountry = country || "Все страны";
    const formattedYear = year || "Все годы";

    return `${formattedGenre}, ${formattedCountry}, ${formattedYear}`;
  };

  if (!moviesData && !isLoading) return <div>Missing movies!</div>;

  return (
    <section className={classes.pageWrapper}>
      <div className={classes.headerBarContainer}>
        <Breadcrumbs />
        <h1 className={classes.title}>Фильмы</h1>
        <div className={classes.parameters}>{formatFilterParameters()}</div>
      </div>
      <MovieFilters onFilter={(filters) => setFilters(filters)} />

      <div className={classes.moviesContainer}>
        <div className={classes.moviesInner}>
          {error && <h1>Произошла ошибка</h1>}

          {(isLoading || isFetching) && moviesList.length === 0 ? (
            <MovieCardSkeleton count={14} />
          ) : (
            <>
              {moviesList.map((movie, index) => (
                <MovieCard movie={movie} key={index} />
              ))}

              {isFetching && page > 1 && <MovieCardSkeleton count={7} />}
            </>
          )}
        </div>
        <button
          className={classes.moreButton}
          onClick={() => setPage(page + 1)}
        >
          Показать еще
        </button>
      </div>
    </section>
  );
};
