import React, { createContext, useContext } from 'react';
import { MediaPlayerMFR } from '../types/GoogleSheetDataTypes';

const MediaPlayerMFRDataContext = createContext<{
  mediaPlayerMFRData: MediaPlayerMFR[];
  setMediaPlayerMFRData: React.Dispatch<React.SetStateAction<MediaPlayerMFR[]>>;
} | undefined>(undefined);

export const useMediaPlayerMFRData = () => {
  const context = useContext(MediaPlayerMFRDataContext);
  if (!context) throw new Error('useMediaPlayerMFRData must be used within a MediaPlayerMFRDataContext.Provider');
  return context;
};

export default MediaPlayerMFRDataContext;

