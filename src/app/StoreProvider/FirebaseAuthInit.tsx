import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from './store';
import { initializeAuth } from '@/features/auth/model/authSlice';
import { FirebaseAuthService } from '@/features/auth/api/firebaseAuthService';

interface FirebaseAuthInitProps {
  children: React.ReactNode;
}

export const FirebaseAuthInit = ({ children }: FirebaseAuthInitProps) => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(initializeAuth());

    const tokenRefreshInterval = setInterval(async () => {
      try {
        const token = await FirebaseAuthService.refreshToken();
        if (token) {
          console.log('Токен успешно обновлен');
        }
      } catch (error) {
        console.error('Ошибка обновления токена:', error);
      }
    }, 45 * 60 * 1000);

    return () => {
      clearInterval(tokenRefreshInterval);
    };
  }, [dispatch]);

  return <>{children}</>;
}; 