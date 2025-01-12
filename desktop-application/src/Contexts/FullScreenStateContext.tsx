import { createContext } from "react";

interface FullScreenStateContextProps {
  isFullScreen: boolean;
  setIsFullScreen: React.Dispatch<React.SetStateAction<boolean>>;
}

const FullScreenStateContext = createContext<FullScreenStateContextProps | undefined>(undefined);

export default FullScreenStateContext;
