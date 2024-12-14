import React, { useContext, useEffect, useState } from "react";
import * as fabric from 'fabric';
import { addRectangleToCanvas } from "../../utils/CanvasDrawingsUtils";
import CanvasObjectsDataContext from "../../Contexts/CanvasObjectsDataContext";

interface CanvusProps {
  fabricCanvasRef: React.MutableRefObject<fabric.Canvas>;
}

const AddingToCanvasComponent  : React.FC <CanvusProps>= ({fabricCanvasRef}) => {

  const { setCanvasObjects } = useContext(CanvasObjectsDataContext);



  return (
    <div className="h-max px-4 py-3 space-y-0 border border-border-color">
      <h4 className="font-semibold text-sm pb-1 opacity-80 ">Components</h4>

      <button
          onClick={() => {
            if (fabricCanvasRef.current) {
              addRectangleToCanvas({ canvas: fabricCanvasRef.current , setCanvasObjects: setCanvasObjects });
            }
          }}
         className="bg-transparent w-full hover:bg-blue-500 text-blue-800 text-xs hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
        >
          Add Rectangle
        </button>

    </div>
  )
}

export default AddingToCanvasComponent