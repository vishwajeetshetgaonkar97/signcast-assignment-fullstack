import React, { useState, useEffect, useMemo, useRef } from "react";
import FabricCanvas from "../FabricCanvas/FabricCanvas";
import ConfigurationSectionComponent from "../ConfigurationSectionComponent/ConfigurationSectionComponent";
import CanvasObjectsDataContext from "../../Contexts/CanvasObjectsDataContext";
import * as fabric from "fabric";
import LoaderComponent from "../LoaderComponent/LoaderComponent";

const DigitalDrawingToolComponent: React.FC = () => {
  // local state references to data

  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);

  const [canvasObjects, setCanvasObjects] = useState<any[]>([]);
  
  const CanvasObjectsDataContextValue = useMemo(
    () => ({ canvasObjects, setCanvasObjects }),
    [canvasObjects, setCanvasObjects]
  );

  const isLoading = false; 

  return (
    <>
      {/* display loader on loading  */} {/* have used this method and not return on state loading to avoid bloacking of internal state updation */}
      <div className={` ${isLoading ? 'show absolute top-0 left-0 h-full w-full flex items-center justify-center bg-bg-color z-50' : 'hidden'}`}>
        <LoaderComponent />
      </div>

      <CanvasObjectsDataContext.Provider value={CanvasObjectsDataContextValue}>
        <div className="flex h-full pb-2 align-center justify-center w-full gap-4 flex-col md:flex-row">
          <FabricCanvas fabricCanvasRef={fabricCanvasRef} />
          <ConfigurationSectionComponent fabricCanvasRef={fabricCanvasRef} />
        </div>
      </CanvasObjectsDataContext.Provider>

    </>
  );
};

export default DigitalDrawingToolComponent;
