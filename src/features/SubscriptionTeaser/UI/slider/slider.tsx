import React from "react";
import classes from "./slider.module.scss";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll, {
  type AutoScrollOptionsType,
} from "embla-carousel-auto-scroll";
import type { EmblaOptionsType } from "embla-carousel";

type props = {
  dataSlidersImg: ImgType[];
  options?: EmblaOptionsType;
  autoScrollOptions?: AutoScrollOptionsType;
};

type ImgType = string;

const Slider: React.FC<props> = ({
  dataSlidersImg,
  options,
  autoScrollOptions = { playOnInit: true, speed: 0.7, startDelay: 100 },
}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(options, [
    AutoScroll(autoScrollOptions),
  ]);
  return (
    <div className={classes.embla}>
      <div className={classes.viewport} ref={emblaRef}>
        <div className={classes.container}>
          {dataSlidersImg.map((img, index) => (
            <div className={classes.slide} key={index}>
              <img src={img} className={classes.img} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Slider;
