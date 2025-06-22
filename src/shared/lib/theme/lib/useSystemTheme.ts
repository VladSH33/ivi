import { useState, useEffect } from 'react';

export const useSystemTheme = (): 'light' | 'dark' => {
  const getSystemTheme = () =>
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

  const [theme, setTheme] = useState<'light' | 'dark'>(getSystemTheme);

  useEffect(() => {
    const mediaQueryList = window.matchMedia('(prefers-color-scheme: dark)');

    const handleThemeChange = (e: MediaQueryListEvent) => {
      setTheme(e.matches ? 'dark' : 'light');
    };

    mediaQueryList.addEventListener('change', handleThemeChange);

    setTheme(getSystemTheme());

    return () => {
      mediaQueryList.removeEventListener('change', handleThemeChange);
    };
  }, []);

  return theme;
}; 