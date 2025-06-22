import React, { useState } from "react";
import classes from "./movieFilters.module.scss";
import { useGetFiltersQuery } from "@/entities/Filter";

import { FilterType } from "@/entities/Filter";

import ArrowDown from "@/shared/assets/icons/arrowDown.svg";
import Close from "@/shared/assets/icons/close.svg";

type MovieFiltersProps = {
  onFilter: (filters: Partial<FilterType>) => void;
};

export const MovieFilters: React.FC<MovieFiltersProps> = ({ onFilter }) => {
  const [visibleElement, setVisibleElement] = useState<keyof FilterType | null>(
    null
  );
  const [selectedFilters, setSelectedFilters] = useState<Partial<FilterType>>(
    {}
  );

  const { data: filters, isLoading } = useGetFiltersQuery();

  const toggleElement = (elementId: keyof FilterType) => {
    setVisibleElement((prev: string) =>
      prev === elementId ? null : elementId
    );
  };

  const handleFilterSelect = (filterType: keyof FilterType, label: string) => {
    if (selectedFilters[filterType] === label) {
      const newFilters = { ...selectedFilters };
      delete newFilters[filterType];
      setSelectedFilters(newFilters);
      onFilter(newFilters);
    } else {
      const newFilters = {
        ...selectedFilters,
        [filterType]: label,
      };
      setSelectedFilters(newFilters);
      onFilter(newFilters);
    }
  };

  const resetFilters = () => {
    setSelectedFilters({});
    onFilter({});
  };

  if (isLoading) return <div className={classes.loadingMessage}>Загрузка фильтров...</div>;

  return (
    <div className={classes.filters}>
      <div className={classes.filtersContainer}>
        <div className={classes.filtersContent}>
          <div className={classes.filtersPlankList}>
            {filters.map((filter, index) => (
              <div
                key={index}
                onClick={() => toggleElement(filter.id)}
                className={classes.plankItem}
              >
                <div className={classes.plank}>
                  <div className={classes.plankInner}>
                    <div className={classes.plankLabel}>{filter.label}</div>
                    {selectedFilters[filter.id] && (
                      <span className={classes.selectedFilterValue}>
                        {selectedFilters[filter.id]}
                      </span>
                    )}
                  </div>

                  <ArrowDown
                    className={`${classes.arrow} ${
                      visibleElement === filter.id ? classes.arrowRotated : ""
                    }`}
                  />
                </div>
                {visibleElement === filter.id && (
                  <div className={classes.filterDropdownGenres}>
                    <div className={classes.filterDropdownGenresContent}>
                      {filter.options.map((option, index) => (
                        <div
                          key={index}
                          className={`${classes.poster} ${
                            selectedFilters[filter.id] === option.label
                              ? classes.selected
                              : ""
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleFilterSelect(filter.id, option.label);
                            setVisibleElement(null);
                          }}
                        >
                          {option.icon ? (
                            <img
                              src={option.icon}
                              alt={`Slide`}
                              loading="lazy"
                            />
                          ) : (
                            ""
                          )}
                          <div className={classes.titleCaption}>
                            {option.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className={classes.filtersbuttonResetWrapper}>
            <button
              className={classes.filtersbuttonReset}
              disabled={Object.keys(selectedFilters).length === 0}
              onClick={resetFilters}
            >
              <Close />
              <span>Сбросить фильтр</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};