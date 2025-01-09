import { createContext } from "react";

interface AllCanvasesDataContextProps {
  allcanvases: any[];
  setAllCanvases: React.Dispatch<React.SetStateAction<any[]>>;
}

const AllCanvasesDataContext = createContext<AllCanvasesDataContextProps | undefined>(undefined);

export default AllCanvasesDataContext;
