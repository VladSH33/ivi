import React from "react";
import classes from "./Footer.module.scss";
import NoAds from "@/shared/assets/icons/noAds.svg";

const Footer = () => {
  return (
    <footer className={classes.footer}>
      <div className={classes.container}>
        <div className={classes.content}>
          <div className={classes.column}>
            <span className={classes.title}>О нас</span>
            <ul className={classes.linkList}>
              <li className={classes.linkItem}>
                <a href="#" className={classes.link}>
                  О компании
                </a>
              </li>
              <li className={classes.linkItem}>
                <a href="#" className={classes.link}>
                  Вакансии
                </a>
              </li>
              <li className={classes.linkItem}>
                <a href="#" className={classes.link}>
                  Программа бета-тестирования
                </a>
              </li>
              <li className={classes.linkItem}>
                <a href="#" className={classes.link}>
                  Информация для партнёров
                </a>
              </li>
              <li className={classes.linkItem}>
                <a href="#" className={classes.link}>
                  Размещение рекламы
                </a>
              </li>
              <li className={classes.linkItem}>
                <a href="#" className={classes.link}>
                  Пользовательское соглашение
                </a>
              </li>
              <li className={classes.linkItem}>
                <a href="#" className={classes.link}>
                  Политика конфиденциальности
                </a>
              </li>
              <li className={classes.linkItem}>
                <a href="#" className={classes.link}>
                  На Иви применяются рекомендательные технологии
                </a>
              </li>
              <li className={classes.linkItem}>
                <a href="#" className={classes.link}>
                  Комплаенс
                </a>
              </li>
              <li className={classes.linkItem}>
                <a href="#" className={classes.link}>
                  Оставить отзыв
                </a>
              </li>
            </ul>
          </div>
          <div className={classes.column}>
            <span className={classes.title}>Разделы</span>
            <ul className={classes.linkList}>
              <li className={classes.linkItem}>
                <a href="#" className={classes.link}>
                  Мой Иви
                </a>
              </li>
              <li className={classes.linkItem}>
                <a href="#" className={classes.link}>
                  Что нового
                </a>
              </li>
              <li className={classes.linkItem}>
                <a href="#" className={classes.link}>
                  Фильмы
                </a>
              </li>
              <li className={classes.linkItem}>
                <a href="#" className={classes.link}>
                  Сериалы
                </a>
              </li>
              <li className={classes.linkItem}>
                <a href="#" className={classes.link}>
                  мультфильмы
                </a>
              </li>
              <li className={classes.linkItem}>
                <a href="#" className={classes.link}>
                  ТВ
                </a>
              </li>
              <li className={classes.linkItem}>
                <a href="#" className={classes.link}>
                  Статьи
                </a>
              </li>
              <li className={`${classes.linkItem} ${classes.certificateLink}`}>
                <a href="#" className={classes.link}>
                  Активация сертификата
                </a>
              </li>
            </ul>
          </div>
          <div className={classes.column}>
            <span className={classes.title}>Служба поддержки</span>
            <div className={classes.description}>
              <span>Мы всегда готовы вам помочь</span>
              <span>Наши операторы онлайн 24/7</span>
            </div>
            <ul className={classes.questions}>
              <li>
                <a href="#" className={classes.phoneNumber}>
                  ask.ivi.ru
                </a>
                <div className={classes.description}>Ответы на вопросы</div>
              </li>
            </ul>
          </div>
          <div className={classes.column}>
            <div className={classes.footerWidget}>
              <div className={classes.iconSection}>
                <NoAds width={56} height={56} />
              </div>
              <p className={classes.text}>
                Смотрите фильмы, сериалы и мультфильмы без рекламы
              </p>
            </div>
          </div>
        </div>
        <div className={classes.contentList}>
          <div className={classes.copyrightContent}>
            <div className={classes.copyrights}>
              <p className={classes.copyrightsSite}>© 2025 ООО «Иви.ру»</p>
              <p className={classes.copyrightsContent}>
                HBO ® and related service marks are the property of Home Box
                Office, Inc
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
