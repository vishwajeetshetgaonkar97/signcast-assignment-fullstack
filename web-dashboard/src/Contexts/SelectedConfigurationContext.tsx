import { createContext, useContext, Dispatch, SetStateAction } from 'react';
import { ScreenMFR, MediaPlayerMFR, Mounts, ReceptacleBox } from '../types/GoogleSheetDataTypes';

type SelectedValues = {
  screenMFR?: ScreenMFR;
  mediaPlayerMFR?: MediaPlayerMFR;
  mount?: Mounts;
  receptacleBox?: ReceptacleBox;
};

const SelectedConfigurationContext = createContext<{
  selectedConfiguration: SelectedValues;
  setSelectedConfiguration: Dispatch<SetStateAction<SelectedValues>>;
} | undefined>(undefined);

export const useSelectedValues = () => {
  const context = useContext(SelectedConfigurationContext);
  if (!context) throw new Error('useSelectedValues must be used within a SelectedConfigurationContext.Provider');
  return context;
};

export default SelectedConfigurationContext;
