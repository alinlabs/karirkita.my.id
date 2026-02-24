import React, { useEffect } from 'react';
import { HalamanPersonal } from './HalamanPersonal';
import { useData } from '../../context/DataContext';

export const Container = () => {
  const { refreshData } = useData();
  
  useEffect(() => {
    refreshData();
  }, []);

  return <HalamanPersonal />;
};