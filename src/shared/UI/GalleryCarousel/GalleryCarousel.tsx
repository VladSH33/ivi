import React, { useState } from "react";

import classes from "./GalleryCarousel.module.scss";
import { MovieCardSkeletons } from "../MovieCardSkeletons/MovieCardSkeletons";
import ArrowRight from "../../assets/icons/arrowRight.svg";

import useEmblaCarousel from "embla-carousel-react";
import type {
  EmblaCarouselType as EmblaApiType,
  EmblaOptionsType,
  EmblaEventType,
} from "embla-carousel";
import { MovieType } from "@/entities/Movie";
import { MovieCard } from "@/entities/Movie";

type GalleryCarouselProps = {
  movies: MovieType[];
  title: {
    title: string;
    href: string;
  };
  options?: EmblaOptionsType;
  isLoading: boolean;
};
export const GalleryCarousel: React.FC<GalleryCarouselProps> = ({
  movies,
  title,
  options,
  isLoading,
}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(options);

  return (
    <section className={classes.gallery}>
      <div className={classes.containerGallery}>
        <div className={classes.header}>
          <a href="/" className={classes.headerLink}>
            {title.title}
          </a>
          <ArrowRight />
        </div>
        <div className={classes.embla}>
          <div className={classes.viewport} ref={emblaRef}>
            <div className={classes.container}>
              {isLoading && movies.length === 0 ? (
                <MovieCardSkeletons count={7} />
              ) : (
                movies.map((movie, index) => (
                  <div className={classes.slide} key={index}>
                    <MovieCard movie={movie} />
                    <div className={classes.textSection}>
                      <div className={classes.title}>{movie.title}</div>
                      <div className={classes.priceBadge}>
                        {movie.priceBadge}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};