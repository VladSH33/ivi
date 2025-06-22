import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useLazySearchMoviesQuery } from "@/features/MovieSearch";
import { useGetPaginationMoviesQuery } from "@/entities/Movie";
import { MovieCard } from "@/entities/Movie";
import { MovieCardSkeletons } from "@/shared/UI/MovieCardSkeletons/MovieCardSkeletons";
import Search from "@/shared/assets/icons/search.svg";
import Close from "@/shared/assets/icons/close.svg";
import classes from "./Search.module.scss";

export const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  
  const [triggerSearch, { data: searchData, isLoading: isSearchLoading, isFetching }] = useLazySearchMoviesQuery();
  const { data: recommendationsData, isLoading: isRecommendationsLoading } = useGetPaginationMoviesQuery({
    page: 1,
    limit: 12
  });

  useEffect(() => {
    const query = searchParams.get("q");
    const page = parseInt(searchParams.get("page") || "1");
    
    if (query) {
      setSearchQuery(query);
      setCurrentPage(page);
      triggerSearch({ query, page });
    }
  }, [searchParams, triggerSearch]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setCurrentPage(1);
      setSearchParams({ q: searchQuery.trim(), page: "1" });
    }
  };

  const handleClose = () => {
    navigate("/");
  };

  const hasSearchQuery = searchQuery.trim().length > 0;
  const showResults = hasSearchQuery && searchData;
  const showRecommendations = !hasSearchQuery || (hasSearchQuery && !searchData?.data?.length);

  return (
    <div className={classes.searchOverlay}>
      <div className={classes.searchModal}>
        <div className={classes.header}>
          <h1 className={classes.title}>Поиск</h1>
          <button 
            className={classes.closeButton}
            onClick={handleClose}
            aria-label="Закрыть поиск"
          >
            <Close width={24} height={24} />
          </button>
        </div>

        <div className={classes.searchSection}>
          <form className={classes.searchForm} onSubmit={handleSearchSubmit}>
            <div className={classes.inputWrapper}>
              <Search className={classes.searchIcon} width={20} height={20} />
              <input
                type="text"
                className={classes.searchInput}
                placeholder="Фильмы, сериалы, жанры и персоны"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
            </div>
          </form>
        </div>

        <div className={classes.content}>
          {showResults && (
            <div className={classes.resultsSection}>
              <h2 className={classes.sectionTitle}>Результаты поиска</h2>
              {searchData?.meta?.message && (
                <p className={classes.resultsCount}>
                  {searchData.meta.message}
                </p>
              )}
              
              {isSearchLoading ? (
                <MovieCardSkeletons count={8} />
              ) : (
                <div className={classes.moviesGrid}>
                  {searchData?.data?.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                  ))}
                </div>
              )}
            </div>
          )}

          {showRecommendations && (
            <div className={classes.recommendationsSection}>
              <h2 className={classes.sectionTitle}>Рекомендации для тебя</h2>
              
              {isRecommendationsLoading ? (
                <MovieCardSkeletons count={12} />
              ) : (
                <div className={classes.moviesGrid}>
                  {recommendationsData?.data?.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 