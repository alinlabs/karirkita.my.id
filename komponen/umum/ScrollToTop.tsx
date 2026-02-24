import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Reset scroll ke posisi (0,0) setiap kali path berubah
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};