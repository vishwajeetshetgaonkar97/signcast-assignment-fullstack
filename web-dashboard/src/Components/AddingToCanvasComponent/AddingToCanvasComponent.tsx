import React, { useContext, useRef, useState, useEffect } from "react";
import * as fabric from 'fabric';
import { addImageToCanvas, addLineToCanvas, addRectangleToCanvas } from "../../utils/CanvasDrawingsUtils";
import CanvasObjectsDataContext from "../../Contexts/CanvasObjectsDataContext";
import AllCanvasesObjectsDataContext from "../../Contexts/AllCanvasesObjectsDataContext";
import updateCanvas from "../../api/updateCanvas";
import SelectedCanvasObjectIndexDataContext from "../../Contexts/SelectedCanvasObjectIndexDataContext";

interface CanvasProps {
  fabricCanvasRef: React.MutableRefObject<fabric.Canvas>;
}

const AddingToCanvasComponent: React.FC<CanvasProps> = ({ fabricCanvasRef }) => {
  const { allcanvases, setAllCanvases } = useContext(AllCanvasesObjectsDataContext);
  const { canvasObjects, setCanvasObjects } = useContext(CanvasObjectsDataContext);
  const { selectedCanvasIndex } = useContext(SelectedCanvasObjectIndexDataContext);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [isSyncRequired, setIsSyncRequired] = useState<boolean>(false);

  // Function to check if current objects match the saved canvas data
  const checkIfSyncRequired = () => {
    const currentCanvasData = allcanvases[selectedCanvasIndex]?.data || [];
    const isSame = JSON.stringify(canvasObjects) === JSON.stringify(currentCanvasData);
    setIsSyncRequired(!isSame); // If they are not the same, sync is required
  };

  // Effect to check sync requirement when canvas objects change
  useEffect(() => {
    checkIfSyncRequired();
  }, [canvasObjects, allcanvases, selectedCanvasIndex]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && fabricCanvasRef.current) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result?.toString();
        if (dataUrl) {
          addImageToCanvas({ url: dataUrl, canvas: fabricCanvasRef.current, setCanvasObjects });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddRectangle = () => {
    if (fabricCanvasRef.current) {
      addRectangleToCanvas({ canvas: fabricCanvasRef.current, setCanvasObjects, canvasObjects });
    }
  };

  const handleAddLine = () => {
    if (fabricCanvasRef.current) {
      addLineToCanvas({ canvas: fabricCanvasRef.current, setCanvasObjects, canvasObjects });
    }
  };

  const handleSyncCanvas = async () => {
    const updateCanvasPostBody = {
      canvasId: allcanvases[selectedCanvasIndex]._id,
      name: allcanvases[selectedCanvasIndex].name,
      category: allcanvases[selectedCanvasIndex].category,
      data: canvasObjects,
    };

    try {
      const log = await updateCanvas(updateCanvasPostBody);
      console.log("log addition", log);
      setIsSyncRequired(false); // Sync successful, no need to sync anymore
    } catch (error) {
      console.log(`canvas sync issue ${error}`);
    }
  };

  return (
    <div className="h-max px-4 py-3 space-y-0 border border-border-color">
      <h4 className="font-semibold text-sm pb-1 opacity-80">Components</h4>
      <div className="flex flex-col w-full pt-2 gap-2">
        <button
          onClick={() => {
            if (fabricCanvasRef.current) {
              handleAddRectangle();
            }
          }}
          className="bg-transparent w-full hover:bg-blue-700 text-blue-700 text-xs hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent"
        >
          Add Rectangle
        </button>

        <button
          onClick={() => {
            if (fabricCanvasRef.current) {
              handleAddLine();
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

        <div className="flex justify-between items-center pt-3">
          <button
            onClick={handleSyncCanvas}
            disabled={!isSyncRequired}
            className={`w-full py-2 px-4 text-xs border ${isSyncRequired ? 'bg-green-700 text-white' : 'bg-gray-300 text-gray-600'}`}
          >
            {isSyncRequired ? 'Sync Changes' : 'No Sync Required'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddingToCanvasComponent;
