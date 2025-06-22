import React, { useState } from "react";
import classes from "./Movie.module.scss";

import { Breadcrumbs } from "@/shared/UI/Breadcrumbs/UI/Breadcrumbs";

import supermanVideo from "@/shared/assets/video/supermanlegacy_trailer2.mp4";

import Favorite from "@/shared/assets/icons/favorite.svg";
import Share from "@/shared/assets/icons/share.svg";

export const Movie = () => {
  const [film, setFilm] = useState({
    title: "Черный сокол",
    hasStub: ["6.9", "98%", "2024", "1ч.33мин.", "16+"],
    genres: [
      { name: "Драма", href: "/series/dramy" },
      { name: "Россия", href: "/series/ru" },
      { name: "США", href: "/series/usa" },
    ],
    synopsis:
      "Близнецы Нух и Мелек в раннем возрасте были брошены родной матерью. На пороге смерти любимая бабушка рассказывает её историю, и брат и сестра решаются отправиться в Каппадокию на поиски Сумру.",
    badges: "Новые серии 16 мая",
  });
  return (
    <section className="pageSection">
      <div className={classes.container}>
        <Breadcrumbs />
        <div className={classes.oversideVideoContainer}>
          <div className={classes.meta}>
            <div className={classes.metaContainer}>
              <div className={classes.title}>{film.title}</div>

              <div className={classes.filmDetails}>
                <div className={classes.infoList}>
                  {film.hasStub.map((infoItem, index) => (
                    <div className={classes.infoItem} key={index}>
                      {infoItem}
                    </div>
                  ))}
                </div>

                <div className={classes.genresList}>
                  <ul className={classes.genresListContainer}>
                    {film.genres.map((genre) => (
                      <a
                        href={genre.href}
                        className={classes.genreLink}
                        title={genre.name}
                        aria-label={genre.name}
                        key={genre.name}
                      >
                        <div className={classes.genreTag}> {genre.name}</div>
                      </a>
                    ))}
                  </ul>
                </div>
              </div>
              <div className={classes.synopsis}>{film.synopsis}</div>
              <div className={classes.actionButtons}>
                <button className={classes.watchButton}>
                  <div className={classes.watchButtonText}>Смотреть</div>
                  <span>По подписке Иви</span>
                </button>
                <button className={classes.favoriteButton}>
                  <Favorite width={16} height={16} />
                </button>
                <button className={classes.shareButton}>
                  <Share width={16} height={16} />
                </button>
              </div>
            </div>
          </div>
          <div className={classes.videoBox}>
            <video autoPlay controls aria-label="Трейлер фильма 'Черный сокол'">
              <source src={supermanVideo} type="video/mp4" />
              Ваш браузер не поддерживает видео.
            </video>
          </div>
        </div>
      </div>
    </section>
  );
};
