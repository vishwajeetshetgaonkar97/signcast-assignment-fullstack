import React, { createContext, useContext } from 'react';
import { ScreenMFR } from '../types/GoogleSheetDataTypes';

const ScreenMFRDataContext = createContext<{
  screenMFRData: ScreenMFR[];
  setScreenMFRData: React.Dispatch<React.SetStateAction<ScreenMFR[]>>;
} | undefined>(undefined);

export const useScreenMFRData = () => {
  const context = useContext(ScreenMFRDataContext);
  if (!context) throw new Error('useScreenMFRData must be used within a ScreenMFRDataContext.Provider');
  return context;
};

export default ScreenMFRDataContext;
