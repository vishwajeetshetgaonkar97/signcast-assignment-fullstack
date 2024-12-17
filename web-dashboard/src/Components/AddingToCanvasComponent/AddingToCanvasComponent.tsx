import React, { useContext, useRef, useState, useEffect } from "react";
import * as fabric from 'fabric';
import { addImageToCanvas, addLineToCanvas, addRectangleToCanvas, addSlideshowToCanvas, addTextToCanvas, addVideoToCanvas } from "../../utils/CanvasDrawingsUtils";
import CanvasObjectsDataContext from "../../Contexts/CanvasObjectsDataContext";
import AllCanvasesObjectsDataContext from "../../Contexts/AllCanvasesObjectsDataContext";
import updateCanvas from "../../api/updateCanvas";
import SelectedCanvasObjectIndexDataContext from "../../Contexts/SelectedCanvasObjectIndexDataContext";
import uploadImage from "../../api/uploadImage";

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

      reader.onload = async (event) => {
        const dataUrl = event.target?.result?.toString();
        if (dataUrl) {
          try {
            const imageUrl = await uploadImage(dataUrl);
            console.log('Image URL:', imageUrl.imageUrl);
            addImageToCanvas({ url: imageUrl.imageUrl, canvas: fabricCanvasRef.current, canvasObjects, setCanvasObjects });
          } catch (error) {
            console.error('Error uploading image:', error);
          }
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


  const handleAddText = () => {
    if (fabricCanvasRef.current) {
      addTextToCanvas({ canvas: fabricCanvasRef.current, setCanvasObjects, canvasObjects });
    }
  };



  const handleSyncCanvas = async () => {
    console.log("canvasObjects", allcanvases);
    const updateCanvasPostBody = {
      canvasId: allcanvases[selectedCanvasIndex]._id,
      name: allcanvases[selectedCanvasIndex].name,
      category: allcanvases[selectedCanvasIndex].category,
      data: canvasObjects,
    };

    try {
      console.log("updateCanvasPostBody", updateCanvasPostBody);
      const log = await updateCanvas(updateCanvasPostBody);
      console.log("log addition", log);
      setIsSyncRequired(false);
    } catch (error) {
      console.log(`canvas sync issue ${error}`);
      alert('Error to sync canvas');
    }
  };

  return (
    <div className="h-max px-4 py-3 space-y-0 border border-border-color">
      <div className="flex justify-between items-center pb-3">
        <button
          onClick={handleSyncCanvas}
          disabled={!isSyncRequired}
          className={`w-full py-2 px-4 text-xs border ${isSyncRequired ? 'bg-green-700 text-white' : 'bg-gray-300 text-gray-600'}`}
        >
          {isSyncRequired ? 'Sync Changes' : 'No Sync Required'}
        </button>
      </div>
      <h4 className="font-semibold text-xs pb-1 opacity-80">Add Components</h4>
      <div className="flex flex-wrap  w-full pt-2 gap-2">
        <button
          onClick={() => {
            if (fabricCanvasRef.current) {
              handleAddRectangle();
            }
          }}
          className="bg-transparent w-[48%] hover:bg-blue-700 text-blue-700 text-xs hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent"
        >
          Add Rectangle
        </button>

        <button
          onClick={() => {
            if (fabricCanvasRef.current) {
              handleAddLine();
            }
          }}
          className="bg-transparent w-[48%]  hover:bg-blue-700 text-blue-700 text-xs hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent"
        >
          Add Line
        </button>

        <button
          onClick={() => {
            if (fabricCanvasRef.current) {
              handleAddText();
            }
          }}
          className="bg-transparent w-full hover:bg-blue-700 text-blue-700 text-xs hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent"
        >
          Add Text
        </button>

        <button
          onClick={() => {
            if (fabricCanvasRef.current) {
              addSlideshowToCanvas( { canvas: fabricCanvasRef.current, setCanvasObjects, canvasObjects });
            }
          }}
          className="bg-transparent w-full hover:bg-blue-700 text-blue-700 text-xs hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent"
        >
          Add Image SlideShow
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
};

export default AddingToCanvasComponent;
