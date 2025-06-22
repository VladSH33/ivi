import { useState } from "react";
import { LoginForm } from "@/features/auth/UI/LoginForm/LoginForm";
import { RegisterForm } from "@/features/auth";
import styles from "./LoginPage.module.scss";

export const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className={styles.pageContainer}>
      <div className={styles.authContainer}>
        <div className={styles.logoContainer}></div>

        <div className={styles.tabs}>
          <button
            className={`${styles.tabButton} ${isLogin ? styles.active : ""}`}
            onClick={() => setIsLogin(true)}
          >
            Вход
          </button>
          <button
            className={`${styles.tabButton} ${!isLogin ? styles.active : ""}`}
            onClick={() => setIsLogin(false)}
          >
            Регистрация
          </button>
        </div>

        <div className={styles.formContainer}>
          {isLogin ? <LoginForm /> : <RegisterForm />}

          <div className={styles.switchText}>
            {isLogin ? (
              <>
                Нет аккаунта?{" "}
                <button
                  className={styles.switchButton}
                  onClick={() => setIsLogin(false)}
                >
                  Зарегистрироваться
                </button>
              </>
            ) : (
              <>
                Уже есть аккаунт?{" "}
                <button
                  className={styles.switchButton}
                  onClick={() => setIsLogin(true)}
                >
                  Войти
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
