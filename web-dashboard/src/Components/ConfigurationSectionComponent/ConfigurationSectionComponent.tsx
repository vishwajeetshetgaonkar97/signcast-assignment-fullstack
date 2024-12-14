import { AiOutlineDownload } from 'react-icons/ai';
import { MdDeleteForever } from "react-icons/md";
import * as fabric from 'fabric';
import { downloadCanvasAsPdf } from '../../utils/CanvasUtils';
import { useContext, useState } from 'react';
import AddingToCanvasComponent from '../AddingToCanvasComponent/AddingToCanvasComponent';
import CanvasObjectsDataContext from '../../Contexts/CanvasObjectsDataContext';

interface CanvusProps {
  fabricCanvasRef: React.MutableRefObject<fabric.Canvas>;
}

const ConfigurationSectionComponent: React.FC<CanvusProps> = ({ fabricCanvasRef }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [canvasPreview, setCanvasPreview] = useState<string | null>(null);
  const { canvasObjects, setCanvasObjects } = useContext(CanvasObjectsDataContext);

  const showCanvasPreview = (canvas: fabric.Canvas) => {
    const dataUrl = canvas.toDataURL();
    setCanvasPreview(dataUrl);
    setIsModalOpen(true);
  };

  const deleteObject = (index: number) => {
    const updatedObjects = canvasObjects.filter((_, i) => i !== index);
    setCanvasObjects(updatedObjects);
  };

  return (
    <div className="flex flex-col gap-4 max-h-full overflow-y-auto">
      <div className="flex flex-col gap-4 max-h-full overflow-y-auto border-border-color border-b border-opacity-50">
        <AddingToCanvasComponent fabricCanvasRef={fabricCanvasRef} />
      </div>

      {/* Render canvasObjects content */}
      <div className="h-max px-4 py-3 space-y-0 border border-border-color">
      <h4 className="font-semibold text-sm pb-1 opacity-80">Layers</h4>
        {canvasObjects.length > 0 ? (
          <ul className="space-y-2">
            {canvasObjects.map((object, index) => (
              <li key={index} className="flex flex-col justify-between items-center p-2 bg-gray-100 rounded-md shadow-sm">
                <span>{object.id || `Object ${index + 1}`}</span>
                <button
                  onClick={() => deleteObject(index)}
                  className="py-1 px-1 text-sm bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  <MdDeleteForever size={18} />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-sm">No objects added to the canvas.</p>
        )}
      </div>


      {/* Download Button */}
      <div className="flex">
        <button
          onClick={() => downloadCanvasAsPdf(fabricCanvasRef.current)}
          className="w-full py-2 text-xs bg-blue-700 text-blue-50 border border-border-color focus:outline-none hover:bg-blue-600 flex items-center justify-between gap-2"
        >
          <span className="flex-1 text-center">Download</span>
          <div className="border-l border-blue-50 border-opacity-50 px-2 flex items-center">
            <AiOutlineDownload size={18} />
          </div>
        </button>
      </div>
    </div>
  );
};

export default ConfigurationSectionComponent;
