import { createContext } from "react";

interface SelectedCanvasObjectIndexDataContextProps {
  selectedCanvasIndex: any;
  setSelectedCanvasIndex: React.Dispatch<React.SetStateAction<any>>;
}

const SelectedCanvasObjectIndexDataContext = createContext<SelectedCanvasObjectIndexDataContextProps | undefined>(undefined);

export default SelectedCanvasObjectIndexDataContext;
