import React, { useState, useEffect, useMemo, useRef } from "react";
import FabricCanvas from "../FabricCanvas/FabricCanvas";
import ConfigurationSectionComponent from "../ConfigurationSectionComponent/ConfigurationSectionComponent";
import CanvasObjectsDataContext from "../../Contexts/CanvasObjectsDataContext";
import * as fabric from "fabric";
import LoaderComponent from "../LoaderComponent/LoaderComponent";
import getCanvases from "../../api/getCanvases";
import AllCanvasesObjectsDataContext from "../../Contexts/AllCanvasesObjectsDataContext";
import SelectedCanvasObjectIndexDataContext from "../../Contexts/SelectedCanvasObjectIndexDataContext";

const DigitalDrawingToolComponent: React.FC = () => {
  // local state references to data

  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const [allcanvases, setAllCanvases] = useState<any[]>([]);
  const [selectedCanvasIndex, setSelectedCanvasIndex] = useState<number>(0);
  const [canvasObjects, setCanvasObjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const AllCanvasObjectsDataContextValue = useMemo(
    () => ({ allcanvases, setAllCanvases }),
    [allcanvases, setAllCanvases]
  );

  const selectedCanvasIndexContextValue = useMemo(
    () => ({ selectedCanvasIndex, setSelectedCanvasIndex }),
    [selectedCanvasIndex, setSelectedCanvasIndex]
  );

  const CanvasObjectsDataContextValue = useMemo(
    () => ({ canvasObjects, setCanvasObjects }),
    [canvasObjects, setCanvasObjects]
  );



  const getAllCanvases = async () => {
    try {
      const data = await getCanvases();
      console.log('canvases', data.canvases);

      setAllCanvases(data.canvases);
      if(data.canvases.length > 0){
        setCanvasObjects(data.canvases[0].data);
      }
      setIsLoading(false);
    } catch (error) {
      console.log(`canvas get issue ${error}`);
      setIsLoading(false);
      alert('Error loading data');
    }
  };


  useEffect(() => {
    getAllCanvases();
  }, []);

  console.log('all canvases', allcanvases);

  return (
    <>
      {/* display loader on loading  */} {/* have used this method and not return on state loading to avoid bloacking of internal state updation */}
      <div className={` ${isLoading ? 'show absolute top-0 left-0 h-full w-full flex items-center justify-center bg-bg-color z-50' : 'hidden'}`}>
        <LoaderComponent />
      </div>
      <AllCanvasesObjectsDataContext.Provider value={AllCanvasObjectsDataContextValue}>
       <SelectedCanvasObjectIndexDataContext.Provider value={selectedCanvasIndexContextValue}>
        <CanvasObjectsDataContext.Provider value={CanvasObjectsDataContextValue}>
          <div className="flex h-full pb-2 align-center justify-center w-full gap-4 flex-col md:flex-row">
            <FabricCanvas fabricCanvasRef={fabricCanvasRef} />
            <ConfigurationSectionComponent fabricCanvasRef={fabricCanvasRef} />
          </div>
        </CanvasObjectsDataContext.Provider>
        </SelectedCanvasObjectIndexDataContext.Provider>
      </AllCanvasesObjectsDataContext.Provider>

    </>
  );
};

export default DigitalDrawingToolComponent;
