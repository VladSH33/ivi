import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { registerWithEmail, clearError } from "../../model/authSlice";
import { AppDispatch, RootState } from "@/app/StoreProvider/store";
import { FirebaseRegisterRequest } from "../../api/firebaseAuthService";
import styles from "./RegisterForm.module.scss";

const registerSchema = yup.object({
  name: yup
    .string()
    .required("Имя обязательно")
    .min(2, "Имя должно содержать минимум 2 символа")
    .max(50, "Имя не должно превышать 50 символов"),
  email: yup
    .string()
    .required("Email обязателен")
    .email("Введите корректный email адрес"),
  password: yup
    .string()
    .required("Пароль обязателен")
    .min(6, "Пароль должен содержать минимум 6 символов")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Пароль должен содержать минимум одну заглавную букву, одну строчную букву и одну цифру"
    ),
}).required();

export const RegisterForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FirebaseRegisterRequest>({
    resolver: yupResolver(registerSchema),
  });

  const clearErrors = () => {
    if (error) {
      dispatch(clearError());
    }
  };

  const onSubmit = async (data: FirebaseRegisterRequest) => {
    clearErrors();
    
    try {
      const result = await dispatch(registerWithEmail(data)).unwrap();
      
      alert("Регистрация успешна! Проверьте вашу почту для подтверждения email адреса.");
      navigate("/profile");
    } catch (err) {
      console.error("Ошибка регистрации:", err);
    }
  };

  return (
    <div className={styles.formContainer}>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        {error && (
          <div className={styles.globalError}>
            {error}
          </div>
        )}

        <input
          {...register("name")}
          placeholder="Имя"
          className={styles.input}
          onChange={clearErrors}
        />
        {errors.name && (
          <span className={styles.error}>{errors.name.message}</span>
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
          {isLoading ? "Регистрация..." : "Зарегистрироваться"}
        </button>

        <div className={styles.infoBlock}>
          <p className={styles.infoText}>
            После регистрации на ваш email будет отправлено письмо для подтверждения адреса.
          </p>
        </div>
      </form>
    </div>
  );
};
