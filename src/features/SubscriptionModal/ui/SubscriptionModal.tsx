import React, { useState, useEffect } from 'react';
import styles from './SubscriptionModal.module.scss';
import { useDispatch } from 'react-redux';
import { PaymentModal } from "@/features/PaymentModal";

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();

  const [isMounted, setIsMounted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

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

  const handleOpenPaymentModal = () => {
    setIsPaymentModalOpen(true);
  };

  const handleClosePaymentModal = () => {
    setIsPaymentModalOpen(false);
  };

  const handleSubscriptionSuccess = () => {
    onClose();
  };

  return (
    <div className={`${styles.modalOverlay} ${isAnimating ? styles.visible : ''}`} onClick={onClose}>
      <div className={`${styles.modalContent} ${isAnimating ? styles.visible : ''}`} onClick={e => e.stopPropagation()}>
        <h2>Оформление подписки</h2>
        <div className={styles.subscriptionInfo}>
          <h3>Премиум подписка</h3>
          <p>Доступ ко всем фильмам и сериалам</p>
          <p>Без рекламы</p>
          <p>Возможность скачивать контент</p>
          <p className={styles.price}>299 ₽/месяц</p>
        </div>
        <div className={styles.buttons}>
          <button className={styles.subscribeButton} onClick={handleOpenPaymentModal}>
            Оформить подписку
          </button>
          <button className={styles.cancelButton} onClick={onClose}>
            Отмена
          </button>
        </div>
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={handleClosePaymentModal}
          onSubscriptionSuccess={handleSubscriptionSuccess}
        />
      </div>
    </div>
  );
}; 