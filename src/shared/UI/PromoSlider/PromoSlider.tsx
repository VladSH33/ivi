import React, { useCallback, useEffect, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import type {
  EmblaCarouselType as EmblaApiType,
  EmblaOptionsType,
  EmblaEventType,
} from "embla-carousel";
import {
  PrevButton,
  NextButton,
  usePrevNextButtons,
} from "./PromoSliderButtons";
import classes from "./PromoSlider.module.scss";

const TWEEN_FACTOR_BASE = 0.84;

const numberWithinRange = (number: number, min: number, max: number): number =>
  Math.min(Math.max(number, min), max);

type SlideContent = {
  imageUrl: string;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
};

type PromoSliderProps = {
  slides: SlideContent[];
  options?: EmblaOptionsType;
  className?: string;
  buttonClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
};

type SlideNode = HTMLElement & {
  style: CSSStyleDeclaration;
};

type Engine = {
  options: {
    loop: boolean;
  };
  slideRegistry: number[][];
  slideLooper: {
    loopPoints: Array<{
      index: number;
      target: () => number;
    }>;
  };
};

export const PromoSlider: React.FC<PromoSliderProps> = ({ slides, options }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(options);
  const tweenFactor = useRef<number>(0);

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi);

  const setTweenFactor = useCallback((emblaApi: EmblaApiType) => {
    tweenFactor.current = TWEEN_FACTOR_BASE * emblaApi.scrollSnapList().length;
  }, []);

  const tweenOpacity = useCallback(
    (emblaApi: EmblaApiType, eventName?: EmblaEventType) => {
      const engine = emblaApi.internalEngine();
      const scrollProgress = emblaApi.scrollProgress();
      const slidesInView = emblaApi.slidesInView();
      const isScrollEvent = eventName === "scroll";

      emblaApi
        .scrollSnapList()
        .forEach((scrollSnap: number, snapIndex: number) => {
          let diffToTarget = scrollSnap - scrollProgress;
          const slidesInSnap = engine.slideRegistry[snapIndex];

          slidesInSnap.forEach((slideIndex: number) => {
            if (isScrollEvent && !slidesInView.includes(slideIndex)) return;

            if (engine.options.loop) {
              engine.slideLooper.loopPoints.forEach(
                (loopItem: { index: number; target: () => number }) => {
                  const target = loopItem.target();

                  if (slideIndex === loopItem.index && target !== 0) {
                    const sign = Math.sign(target);

                    if (sign === -1) {
                      diffToTarget = scrollSnap - (1 + scrollProgress);
                    }
                    if (sign === 1) {
                      diffToTarget = scrollSnap + (1 - scrollProgress);
                    }
                  }
                }
              );
            }

            const tweenValue = 1 - Math.abs(diffToTarget * tweenFactor.current);
            const opacity = numberWithinRange(tweenValue, 0, 1).toString();
            const slideNode = emblaApi.slideNodes()[slideIndex];
            if (slideNode) {
              slideNode.style.opacity = opacity;
            }
          });
        });
    },
    []
  );

  useEffect(() => {
    if (!emblaApi) return;

    setTweenFactor(emblaApi);
    tweenOpacity(emblaApi);

    emblaApi
      .on("reInit", setTweenFactor)
      .on("reInit", () => tweenOpacity(emblaApi))
      .on("scroll", () => tweenOpacity(emblaApi, "scroll"))
      .on("slideFocus", () => tweenOpacity(emblaApi, "slideFocus"));

    return () => {
      emblaApi
        .off("reInit", setTweenFactor)
        .off("reInit", () => tweenOpacity(emblaApi))
        .off("scroll", () => tweenOpacity(emblaApi, "scroll"))
        .off("slideFocus", () => tweenOpacity(emblaApi, "slideFocus"));
    };
  }, [emblaApi, tweenOpacity, setTweenFactor]);

  return (
    <section className={classes.embla}>
      <div className={classes.viewport} ref={emblaRef}>
        <div className={classes.container}>
          {slides.map((slide, index) => (
            <div className={classes.slide} key={index}>
              <div className={classes.slideContent}>
                <img
                  className={classes.slideImg}
                  src={slide.imageUrl}
                  alt={`Slide ${index + 1}`}
                  loading="lazy"
                />
                <div className={classes.textOverlay}>
                  <h3 className={classes.slideTitle}>{slide.title}</h3>
                  <p className={classes.slideDescription}>
                    {slide.description}
                  </p>
                  <a
                    href={slide.buttonLink}
                    className={classes.slideButton}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {slide.buttonText}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={classes.controls}>
        <div className={classes.buttons}>
          <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
          <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
        </div>
      </div>
    </section>
  );
};
