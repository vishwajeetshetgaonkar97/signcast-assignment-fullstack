import React, { createContext, useContext } from 'react';
import { ReceptacleBox } from '../types/GoogleSheetDataTypes';

const ReceptacleBoxDataContext = createContext<{
  receptacleBoxData: ReceptacleBox[];
  setReceptacleBoxData: React.Dispatch<React.SetStateAction<ReceptacleBox[]>>;
} | undefined>(undefined);

export const useReceptacleBoxData = () => {
  const context = useContext(ReceptacleBoxDataContext);
  if (!context) throw new Error('useReceptacleBoxData must be used within a ReceptacleBoxDataContext.Provider');
  return context;
};

export default ReceptacleBoxDataContext;
