import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword, clearError } from "../../model/authSlice";
import { AppDispatch, RootState } from "@/app/StoreProvider/store";
import styles from "./ResetPasswordForm.module.scss";

interface ResetPasswordFormProps {
  onClose?: () => void;
  onSuccess?: () => void;
}

export const ResetPasswordForm = ({ onClose, onSuccess }: ResetPasswordFormProps) => {
  const [email, setEmail] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);

  const clearErrors = () => {
    if (error) {
      dispatch(clearError());
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();

    if (!email.trim()) {
      return;
    }

    try {
      await dispatch(resetPassword(email)).unwrap();
      setIsSuccess(true);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error("Ошибка сброса пароля:", err);
    }
  };

  if (isSuccess) {
    return (
      <div className={styles.container}>
        <div className={styles.successMessage}>
          <h3>Письмо отправлено!</h3>
          <p>
            Мы отправили инструкции по восстановлению пароля на адрес{" "}
            <strong>{email}</strong>
          </p>
          <p>Проверьте свою почту и следуйте инструкциям в письме.</p>
          {onClose && (
            <button onClick={onClose} className={styles.button}>
              Закрыть
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <h3>Восстановление пароля</h3>
        <p className={styles.description}>
          Введите ваш email адрес, и мы отправим вам ссылку для восстановления пароля
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && (
            <div className={styles.globalError}>
              {error}
            </div>
          )}

          <input
            type="email"
            placeholder="Введите ваш email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              clearErrors();
            }}
            className={styles.input}
            disabled={isLoading}
            required
          />

          <div className={styles.buttonGroup}>
            <button 
              type="submit" 
              disabled={isLoading || !email.trim()} 
              className={styles.button}
            >
              {isLoading ? "Отправка..." : "Отправить"}
            </button>
            
            {onClose && (
              <button 
                type="button" 
                onClick={onClose} 
                className={`${styles.button} ${styles.secondaryButton}`}
                disabled={isLoading}
              >
                Отмена
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}; 