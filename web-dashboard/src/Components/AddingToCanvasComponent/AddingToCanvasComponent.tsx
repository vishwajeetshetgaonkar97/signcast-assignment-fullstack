import React, { useContext, useRef, useState } from "react";
import * as fabric from 'fabric';
import { addImageToCanvas, addLineToCanvas, addRectangleToCanvas } from "../../utils/CanvasDrawingsUtils";
import CanvasObjectsDataContext from "../../Contexts/CanvasObjectsDataContext";

interface CanvasProps {
  fabricCanvasRef: React.MutableRefObject<fabric.Canvas>;
}

const AddingToCanvasComponent: React.FC<CanvasProps> = ({ fabricCanvasRef }) => {
  const { canvasObjects, setCanvasObjects } = useContext(CanvasObjectsDataContext);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  console.log("canvas object", canvasObjects);




  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && fabricCanvasRef.current) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result?.toString();
        if (dataUrl) {
          addImageToCanvas({ url: dataUrl, canvas: fabricCanvasRef.current , setCanvasObjects: setCanvasObjects});
        }
      };
      reader.readAsDataURL(file);
    }
  };

  
  return (
    <div className="h-max px-4 py-3 space-y-0 border border-border-color">
      <h4 className="font-semibold text-sm pb-1 opacity-80">Components</h4>
      <div className="flex flex-col w-full pt-2 gap-2">
        <button
          onClick={() => {
            if (fabricCanvasRef.current) {
              addRectangleToCanvas({ canvas: fabricCanvasRef.current, setCanvasObjects: setCanvasObjects });
            }
          }}
          className="bg-transparent w-full hover:bg-blue-700 text-blue-700 text-xs hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent"
        >
          Add Rectangle
        </button>

        <button
          onClick={() => {
            if (fabricCanvasRef.current) {
              addLineToCanvas({ canvas: fabricCanvasRef.current, setCanvasObjects: setCanvasObjects });
            }
          }}
          className="bg-transparent w-full hover:bg-blue-700 text-blue-700 text-xs hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent"
        >
          Add Line
        </button>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          style={{ display: 'none' }}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="bg-transparent w-full hover:bg-blue-700 text-blue-700 text-xs hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent"
          >
          Add Image
        </button>

      </div>
    </div>
  );
}

export default AddingToCanvasComponent;
