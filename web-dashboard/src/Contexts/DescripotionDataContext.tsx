import { createContext, useContext, Dispatch, SetStateAction } from 'react';
import { DescriptionConfig } from '../types/GoogleSheetDataTypes';


const DescripotionDataContext = createContext<{
  descriptionConfiguration: DescriptionConfig;
  setDescriptionConfiguration: Dispatch<SetStateAction<DescriptionConfig>>;
} | undefined>(undefined);

export const useScreenMFRData = () => {
  const context = useContext(DescripotionDataContext);
  if (!context) throw new Error('useScreenMFRData must be used within a DescripotionDataContext.Provider');
  return context;
};

export default DescripotionDataContext;
