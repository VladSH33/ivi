import React from "react";
import classes from "./Main.module.scss";
import { useGetMoviesQuery } from "@/entities/Movie";

import film1 from "@/shared/assets/image/film1.jpg";
import film2 from "@/shared/assets/image/film2.jpg";
import film3 from "@/shared/assets/image/film3.jpg";
import film4 from "@/shared/assets/image/film4.jpg";

import { PromoSlider } from "@/shared/UI/PromoSlider/PromoSlider";
import { GalleryCarousel } from "@/shared/UI/GalleryCarousel/GalleryCarousel";

const SLIDES = [
  {
    imageUrl: film1,
    title: "Заголовок слайда 1",
    description: "Описание для второго слайда",
    buttonText: "Смотреть по подписке",
    buttonLink: "/link1",
  },
  {
    imageUrl: film2,
    title: "Заголовок слайда 2",
    description: "Описание для первого слайда",
    buttonText: "Смотреть по подписке",
    buttonLink: "/link2",
  },
  {
    imageUrl: film3,
    title: "Заголовок слайда 3",
    description: "Описание для третьего слайда",
    buttonText: "Смотреть по подписке",
    buttonLink: "/link3",
  },
  {
    imageUrl: film4,
    title: "Заголовок слайда 4",
    description: "Описание для третьего слайда",
    buttonText: "Смотреть по подписке",
    buttonLink: "/link4",
  },
];

const Main = () => {
  const {
    data: movies = [],
    isLoading,
    isFetching,
    error,
  } = useGetMoviesQuery();
  if (error) return <div>Ошибка загрузки фильмов</div>;

  let categories = [
    {
      header: {
        title: "Лучшее в подписке",
        href: "#",
      },
      movies,
    },
  ];

  return (
    <>
      <PromoSlider slides={SLIDES} options={{ loop: true }} />
      <section className={classes.pageWrapper}>
        <div className={classes.container}>
          <div className={classes.galleryCarouselWrapper}>
            {categories.map((category, index) => (
              <GalleryCarousel
                movies={category.movies}
                title={category.header}
                options={{ slidesToScroll: "auto" as const }}
                isLoading={isLoading}
                key={index}
              />
            ))}

          </div>
        </div>
      </section>
    </>
  );
};

export default Main;
