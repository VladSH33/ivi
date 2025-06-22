import React, { useState } from "react";
import classes from "./MovieCard.module.scss";

import { useNavigate } from "react-router-dom";

import Favorite from "@/shared/assets/icons/favorite.svg";
import Share from "@/shared/assets/icons/share.svg";
import Similar from "@/shared/assets/icons/similar.svg";
import Rating from "@/shared/assets/icons/rating.svg";
import Hide from "@/shared/assets/icons/hide.svg";

import { MovieType } from "@/entities/Movie";

type MovieCardProps = {
  movie: MovieType;
};

export const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const router = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div
      className={classes.card}
      onClick={() => router(`/movie/${movie.url}`)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        className={classes.slideImg}
        src={movie.imageUrl}
        alt={`Slide`}
        loading="lazy"
      />
      {isHovered && (
        <>
          <div className={classes.overlay}></div>
          <div className={classes.content}>
            <div className={classes.rating}>{movie.rating}</div>
            <div className={classes.description}>
              <div>{movie.description.country}</div>
              <div>{movie.description.genre}</div>
              <div>{movie.description.year}</div>
            </div>
          </div>

          <div className={classes.actions}>
            <button className={classes.actionButton} title="Добавить в избранное">
              <Favorite className={classes.iconSvg} />
            </button>
            <button className={classes.actionButton} title="Поделиться">
              <Share className={classes.iconSvg} />
            </button>
            <button className={classes.actionButton} title="Похожие фильмы">
              <Similar className={classes.iconSvg} />
            </button>
            <button className={classes.actionButton} title="Оценить">
              <Rating className={classes.iconSvg} />
            </button>
            <button className={classes.actionButton} title="Скрыть">
              <Hide className={classes.iconSvg} />
            </button>
          </div>
        </>
      )}
    </div>
  );
};
