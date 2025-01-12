import { createContext } from "react";

interface AutoSyncStateContextProps {
  isAutoSync: boolean;
  setIsAutoSync: React.Dispatch<React.SetStateAction<boolean>>;
}

const AutoSyncStateContext = createContext<AutoSyncStateContextProps | undefined>(undefined);

export default AutoSyncStateContext;
