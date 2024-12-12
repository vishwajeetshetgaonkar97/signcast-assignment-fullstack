import React, { createContext, useContext } from 'react';
import { Mounts } from '../types/GoogleSheetDataTypes';

const MountsDataContext = createContext<{
  mountsData: Mounts[];
  setMountsData: React.Dispatch<React.SetStateAction<Mounts[]>>;
} | undefined>(undefined);

export const useMountsData = () => {
  const context = useContext(MountsDataContext);
  if (!context) throw new Error('useMountsData must be used within a MountsDataContext.Provider');
  return context;
};

export default MountsDataContext;
