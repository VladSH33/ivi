import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { loginWithEmail, clearError } from "../../model/authSlice";
import { AppDispatch, RootState } from "@/app/StoreProvider/store";
import { FirebaseLoginRequest } from "../../api/firebaseAuthService";
import { ResetPasswordForm } from "../ResetPasswordForm/ResetPasswordForm";
import styles from "./LoginForm.module.scss";


const loginSchema = yup.object({
  email: yup
    .string()
    .required("Email обязателен")
    .email("Введите корректный email адрес"),
  password: yup
    .string()
    .required("Пароль обязателен")
    .min(6, "Пароль должен содержать минимум 6 символов"),
}).required();

export const LoginForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);
  const [showResetPassword, setShowResetPassword] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FirebaseLoginRequest>({
    resolver: yupResolver(loginSchema),
  });


  const clearErrors = () => {
    if (error) {
      dispatch(clearError());
    }
  };

  const onSubmit = async (data: FirebaseLoginRequest) => {
    clearErrors();
    
    try {
      const result = await dispatch(loginWithEmail(data)).unwrap();
      navigate("/profile");
    } catch (err) {
      console.error("Ошибка входа:", err);

    }
  };

  const handleResetPasswordClick = () => {
    setShowResetPassword(true);
  };

  const handleResetPasswordClose = () => {
    setShowResetPassword(false);
  };

  const handleResetPasswordSuccess = () => {
    setShowResetPassword(false);
  };

  if (showResetPassword) {
    return (
      <ResetPasswordForm 
        onClose={handleResetPasswordClose}
        onSuccess={handleResetPasswordSuccess}
      />
    );
  }

  return (
    <div className={styles.formContainer}>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        {error && (
          <div className={styles.globalError}>
            {error}
          </div>
        )}

        <input
          {...register("email")}
          placeholder="Email"
          className={styles.input}
          onChange={clearErrors}
        />
        {errors.email && (
          <span className={styles.error}>{errors.email.message}</span>
        )}

        <input
          {...register("password")}
          type="password"
          placeholder="Пароль"
          className={styles.input}
          onChange={clearErrors}
        />
        {errors.password && (
          <span className={styles.error}>{errors.password.message}</span>
        )}

        <button type="submit" disabled={isLoading} className={styles.button}>
          {isLoading ? "Вход..." : "Войти"}
        </button>

        <div className={styles.forgotPassword}>
          <span>Забыли пароль? </span>
          <button 
            type="button" 
            className={styles.linkButton}
            onClick={handleResetPasswordClick}
          >
            Восстановить
          </button>
        </div>
      </form>
    </div>
  );
};
