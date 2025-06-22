import React from "react";
import classes from "./SubscriptionTeaser.module.scss";
import Slider from "./slider/slider";
import Logo from "@/shared/assets/icons/mimiLogo.svg";

type SubscriptionTeaserProps = {
  dataSlidersImg: {
    sliderImg1: ImgType[];
    sliderImg2: ImgType[];
    sliderImg3: ImgType[];
  };
};

type ImgType = string;

export const SubscriptionTeaser: React.FC<SubscriptionTeaserProps> = ({
  dataSlidersImg,
}) => {
  return (
    <div className={classes.sideContentWidget}>
      <div className={classes.posterBlock}>
        <Slider
          dataSlidersImg={dataSlidersImg.sliderImg1}
          options={{ loop: true }}
        />
        <Slider
          dataSlidersImg={dataSlidersImg.sliderImg2}
          options={{ loop: true }}
          autoScrollOptions={{
            playOnInit: true,
            speed: 0.3,
            direction: "backward",
            startDelay: 100,
          }}
        />
        <Slider
          dataSlidersImg={dataSlidersImg.sliderImg3}
          options={{ loop: true }}
        />
      </div>
      <div className={classes.leftFade} />
      <div className={classes.rightFade} />
      <div className={classes.bottomPanel}>
        <div className={classes.bottomFade}></div>
        <div className={classes.detailsBlock}>
          <div className={classes.logo}>
            <Logo width={48} height={48} />
          </div>
          <div className={classes.textBlock}>
            <div className={classes.title}>Подписка Иви</div>
            <div className={classes.extra}>От 199 ₽ за месяц</div>
          </div>
        </div>
        <div className={classes.buttonWrapper}>
          <button className={classes.btn}>Подключить</button>
        </div>
        <div className={classes.note}>Отключить можно в любой момент</div>
      </div>
    </div>
  );
};
