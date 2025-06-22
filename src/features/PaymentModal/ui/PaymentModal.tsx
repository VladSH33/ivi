import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import styles from './PaymentModal.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { setSubscription } from '@/features/auth/model/authSlice';
import { RootState } from '@/app/StoreProvider/store';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscriptionSuccess: () => void;
}

interface PaymentFormData {
  cardNumber: string;
  csv: string;
  expires: string;
}

const paymentSchema = yup.object({
  cardNumber: yup
    .string()
    .required("Номер карты обязателен")
    .matches(/^\d{4}\s?\d{4}\s?\d{4}\s?\d{4}$/, "Введите корректный номер карты (16 цифр)")
    .transform((value) => value.replace(/\s/g, '')),
  expires: yup
    .string()
    .required("Срок действия обязателен")
    .matches(/^(0[1-9]|1[0-2])\/\d{2}$/, "Введите дату в формате ММ/ГГ")
    .test('future-date', 'Карта просрочена', function(value) {
      if (!value) return false;
      const [month, year] = value.split('/');
      const expiryDate = new Date(2000 + parseInt(year), parseInt(month) - 1);
      const now = new Date();
      return expiryDate > now;
    }),
  csv: yup
    .string()
    .required("CSV код обязателен")
    .matches(/^\d{3}$/, "CSV должен содержать 3 цифры"),
}).required();

export const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, onSubscriptionSuccess }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<PaymentFormData>({
    resolver: yupResolver(paymentSchema),
  });

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpires = (value: string) => {
    const v = value.replace(/\D/g, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
      setTimeout(() => setIsMounted(false), 300);
    }
  }, [isOpen]);

  if (!isMounted) return null;

  const onSubmit = (data: PaymentFormData) => {
    console.log('Данные оплаты:', data);
    console.log('Обработка оплаты...');

    setTimeout(() => {
      dispatch(setSubscription(true));
      console.log('Подписка успешно оформлена!');
      onSubscriptionSuccess();
      onClose();
    }, 1500);
  };

  return (
    <div className={`${styles.modalOverlay} ${isAnimating ? styles.visible : ''}`} onClick={onClose}>
      <div className={`${styles.modalContent} ${isAnimating ? styles.visible : ''}`} onClick={e => e.stopPropagation()}>
        <h2>Введите данные карты</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.formGroup}>
            <label htmlFor="cardNumber">Номер карты</label>
            <input
              {...register("cardNumber")}
              type="text"
              id="cardNumber"
              placeholder="1234 5678 9012 3456"
              maxLength={19}
              onChange={(e) => {
                const formatted = formatCardNumber(e.target.value);
                setValue('cardNumber', formatted);
              }}
            />
            {errors.cardNumber && (
              <span className={styles.error}>{errors.cardNumber.message}</span>
            )}
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="expires">Срок действия (MM/YY)</label>
            <input
              {...register("expires")}
              type="text"
              id="expires"
              placeholder="12/25"
              maxLength={5}
              onChange={(e) => {
                const formatted = formatExpires(e.target.value);
                setValue('expires', formatted);
              }}
            />
            {errors.expires && (
              <span className={styles.error}>{errors.expires.message}</span>
            )}
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="csv">CSV</label>
            <input
              {...register("csv")}
              type="text"
              id="csv"
              placeholder="123"
              maxLength={3}
            />
            {errors.csv && (
              <span className={styles.error}>{errors.csv.message}</span>
            )}
          </div>
          
          <div className={styles.buttons}>
            <button type="submit" className={styles.payButton}>
              Подключить за 39 999 ₽
            </button>
            <button type="button" className={styles.cancelButton} onClick={onClose}>
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 