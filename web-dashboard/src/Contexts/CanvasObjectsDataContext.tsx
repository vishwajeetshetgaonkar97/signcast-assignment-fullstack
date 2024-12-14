import { createContext } from "react";

interface CanvasObjectsContextProps {
  canvasObjects: any[];
  setCanvasObjects: React.Dispatch<React.SetStateAction<any[]>>;
}

const CanvasObjectsDataContext = createContext<CanvasObjectsContextProps | undefined>(undefined);

export default CanvasObjectsDataContext;
