import { createContext } from "react";

interface AllCanvasesObjectsDataContextProps {
  allcanvases: any[];
  setAllCanvases: React.Dispatch<React.SetStateAction<any[]>>;
}

const AllCanvasesObjectsDataContext = createContext<AllCanvasesObjectsDataContextProps | undefined>(undefined);

export default AllCanvasesObjectsDataContext;
