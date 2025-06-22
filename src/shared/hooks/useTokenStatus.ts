import { useEffect, useState } from 'react';
import { auth } from '@/app/firebase';
import { onAuthStateChanged } from 'firebase/auth';

interface TokenStatus {
  isTokenValid: boolean;
  isLoading: boolean;
  expirationTime: Date | null;
  timeUntilExpiry: number | null;
}

export const useTokenStatus = (): TokenStatus => {
  const [tokenStatus, setTokenStatus] = useState<TokenStatus>({
    isTokenValid: false,
    isLoading: true,
    expirationTime: null,
    timeUntilExpiry: null,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const tokenResult = await user.getIdTokenResult();
          const expirationTime = new Date(tokenResult.expirationTime);
          const currentTime = new Date();
          const timeUntilExpiry = Math.floor((expirationTime.getTime() - currentTime.getTime()) / 1000);
          
          setTokenStatus({
            isTokenValid: timeUntilExpiry > 0,
            isLoading: false,
            expirationTime,
            timeUntilExpiry: timeUntilExpiry > 0 ? timeUntilExpiry : null,
          });
        } catch (error) {
          console.error('Ошибка получения информации о токене:', error);
          setTokenStatus({
            isTokenValid: false,
            isLoading: false,
            expirationTime: null,
            timeUntilExpiry: null,
          });
        }
      } else {
        setTokenStatus({
          isTokenValid: false,
          isLoading: false,
          expirationTime: null,
          timeUntilExpiry: null,
        });
      }
    });

    return () => unsubscribe();
  }, []);

  return tokenStatus;
}; 