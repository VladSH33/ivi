import React, { useState, useRef, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/app/StoreProvider/store";

import { setTheme, toggleTheme, useSystemTheme } from "@/shared/lib/theme";

import Logo from "@/shared/assets/icons/logoIVI.svg";
import Search from "@/shared/assets/icons/search.svg";
import Avatar from "@/shared/assets/icons/avatar.svg";
import PromoSmartTv from "@/shared/assets/icons/promoSmartTv.svg";
import Catalog from "@/shared/assets/icons/catalog.svg";
import Home from "@/shared/assets/icons/home.svg";
import ThemeLight from "@/shared/assets/icons/theme.svg";
import ThemeDark from "@/shared/assets/icons/themeDark.svg";
import classes from "./Header.module.scss";
import { SubscriptionTeaser } from "@/features/SubscriptionTeaser";
import i1 from "@/shared/assets/image/SubscriptionTeaser/i1.jpeg";
import i2 from "@/shared/assets/image/SubscriptionTeaser/i2.jpeg";
import i3 from "@/shared/assets/image/SubscriptionTeaser/i3.jpeg";
import i4 from "@/shared/assets/image/SubscriptionTeaser/i4.jpeg";
import i5 from "@/shared/assets/image/SubscriptionTeaser/i5.jpeg";
import i6 from "@/shared/assets/image/SubscriptionTeaser/i6.jpeg";
import i7 from "@/shared/assets/image/SubscriptionTeaser/i7.jpeg";
import i8 from "@/shared/assets/image/SubscriptionTeaser/i8.jpeg";
import i9 from "@/shared/assets/image/SubscriptionTeaser/i9.jpeg";
import { SubscriptionModal } from "@/features/SubscriptionModal";

const dataSlidersImg = {
  sliderImg1: [i1, i2, i3],
  sliderImg2: [i4, i5, i6],
  sliderImg3: [i7, i8, i9],
};

export const Header = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  const currentTheme = useSelector((state: RootState) => state.theme.theme);
  const systemTheme = useSystemTheme();
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("theme")) {
      dispatch(setTheme(systemTheme));
    }
  }, [systemTheme, dispatch]);

  const handleOpenSubscriptionModal = () => {
    setIsSubscriptionModalOpen(true);
  };

  const handleCloseSubscriptionModal = () => {
    setIsSubscriptionModalOpen(false);
  };

  const handleSubscribeClick = () => {
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      handleOpenSubscriptionModal();
    }
  };

  const menuItems = [
    { title: "Фильмы", href: "/movies" },
    { title: "Сериалы", href: "/serials" },
    { title: "Мультфильмы", href: "/animation" },
    { title: "ТВ", href: "/tvplus" },
  ];

  const mobileNavItems = [
    { title: "Мой IVI", href: "/", icon: Home },
    { title: "Каталог", href: "/movies", icon: Catalog },
    { title: "Поиск", href: "/search", icon: Search },
    { title: "Аккаунт", href: isAuthenticated ? "/profile" : "/login", icon: Avatar },
    { 
      title: currentTheme === "light" ? "Темная" : "Светлая", 
      href: "#", 
      icon: currentTheme === "light" ? ThemeDark : ThemeLight, 
      isThemeToggle: true 
    },
  ];

  const [isHovered, setIsHovered] = useState(false);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);

  return (
    <>
      <header className={classes.header}>
        <div className={classes.container}>
          <div className={classes.logo}>
            <Link
              to="/"
              className={classes.logoLink}
              title="Онлайн-кинотеатр Иви"
              aria-label="IVI Главная"
            >
              <Logo width={66} height={48} />
            </Link>
          </div>

          <div className={classes.myIviMenuItem}>
            <Link to="/" className={classes.myIviLink}>
              Мой Иви
            </Link>
          </div>

          <nav
            className={classes.nav}
            onMouseEnter={() => setIsHovered(true)}
          >
            <ul className={classes.menu}>
              {menuItems.map((item) => (
                <li key={item.href} className={classes.menuItem}>
                  <Link
                    to={item.href}
                    className={classes.menuLink}
                    title={item.title}
                    aria-label={item.title}
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {isHovered && (
            <div 
              className={classes.dropdownWrapper}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <div className={classes.dropdown}>
                <div className={classes.dropdownContent}>
                  <div className={classes.doubleColumn}>
                    <div className={classes.linksList}>
                      <div className={classes.title}>Жанры</div>
                      <div className={classes.list}>
                        <div className={classes.item}>Аниме</div>
                        <div className={classes.item}>Мелодрамы</div>
                        <div className={classes.item}>Боевики</div>
                        <div className={classes.item}>Комедии</div>
                        <div className={classes.item}>Драмы</div>
                        <div className={classes.item}>Триллеры</div>
                        <div className={classes.item}>Ужасы</div>
                        <div className={classes.item}>Фантастика</div>
                        <div className={classes.item}>Фэнтези</div>
                      </div>
                    </div>
                  </div>

                  <div className={classes.singleColumn}>
                    <div className={classes.linksList}>
                      <div className={classes.title}>Страны</div>
                      <div className={classes.list}>
                        <div className={classes.item}>Русские</div>
                        <div className={classes.item}>Зарубежные</div>
                        <div className={classes.item}>Советское кино</div>
                      </div>
                    </div>

                    <div className={classes.linksList}>
                      <div className={classes.title}>Годы</div>
                      <div className={classes.list}>
                        <div className={classes.item}>2025</div>
                        <div className={classes.item}>2024</div>
                        <div className={classes.item}>2023</div>
                        <div className={classes.item}>2022</div>
                      </div>
                    </div>
                  </div>

                  <div className={classes.sideContent}>
                    <div className={classes.linksList}>
                      <div className={classes.list}>
                        <div className={classes.item}>Новинки</div>
                        <div className={classes.item}>Подборки</div>
                        <div className={classes.item}>Иви.Рейтинг</div>
                        <div className={classes.item}>Трейлеры</div>
                      </div>
                    </div>

                    <div className={classes.sideContentWidget}>
                      <SubscriptionTeaser dataSlidersImg={dataSlidersImg} />
                      <a href="/tvsmart" className={classes.linkSmartTv}>
                        <div className={classes.imgSvg}>
                          <PromoSmartTv width={18} height={18} />
                        </div>
                        <span>Подключить Smart TV</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className={classes.actions}>
            {!user?.isSubscribed && (
              <button
                className={classes.subscribeButton}
                onClick={handleSubscribeClick}
              >
                Оплатить подписку
              </button>
            )}

            {user?.isSubscribed && (
              <span className={classes.subscribedStatus}>Подписка активна</span>
            )}

            <Link to="/search" aria-label="Поиск" className={classes.searchButton}>
              <Search width={17} height={17} />
              <span>Поиск</span>
            </Link>
          </div>

          {isAuthenticated ? (
            <Link
              to="/profile"
              className={classes.profileButton}
              aria-label={user ? "Профиль" : "Войти"}
            >
              <span>{user ? user.name : "Войти"}</span>
            </Link>
          ) : (
            <Link to="/login" className={classes.loginButton}>
              <Avatar width={17} height={17} />
              <span>Войти</span>
            </Link>
          )}

          <button
            className={classes.themeToggleButton}
            onClick={() => dispatch(toggleTheme())}
            title="Переключить тему"
            aria-label={`Switch to ${
              currentTheme === "light" ? "dark" : "light"
            } theme`}
          >
            {currentTheme === "light" ? (
              <ThemeDark width={18} height={18} />
            ) : (
              <ThemeLight width={18} height={18} />
            )}
            <span>{currentTheme === "light" ? "Темная тема" : "Светлая тема"}</span>
          </button>
        </div>

        <SubscriptionModal
          isOpen={isSubscriptionModalOpen}
          onClose={handleCloseSubscriptionModal}
        />
      </header>

      <nav className={classes.mobileNavigation}>
        <div className={classes.mobileNavItems}>
          {mobileNavItems.map((item) => {
            const isActive = () => {
              if (item.isThemeToggle) return false;
              if (item.href === "/") {
                return location.pathname === "/";
              }
              if (item.href === "/movies") {
                return location.pathname.startsWith("/movies") || location.pathname.startsWith("/serials") || location.pathname.startsWith("/animation") || location.pathname.startsWith("/tvplus");
              }
              if (item.href === "/search") {
                return location.pathname.startsWith("/search");
              }
              if (item.href === "/profile" || item.href === "/login") {
                return location.pathname.startsWith("/profile") || location.pathname.startsWith("/login");
              }
              return false;
            };

            if (item.isThemeToggle) {
              return (
                <button
                  key="theme-toggle"
                  className={`${classes.mobileNavItem} ${classes.themeToggleMobile}`}
                  onClick={() => dispatch(toggleTheme())}
                  aria-label="Переключить тему"
                >
                  <item.icon className={classes.mobileNavIcon} width={22} height={22} />
                  <span>{item.title}</span>
                </button>
              );
            }

            return (
              <Link
                key={item.href}
                to={item.href}
                className={`${classes.mobileNavItem} ${isActive() ? classes.active : ""}`}
                aria-label={item.title}
              >
                <item.icon className={classes.mobileNavIcon} width={22} height={22} />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
};
