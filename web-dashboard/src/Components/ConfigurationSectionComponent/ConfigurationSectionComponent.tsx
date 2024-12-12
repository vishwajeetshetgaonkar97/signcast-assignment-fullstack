import { AiOutlineDownload } from 'react-icons/ai';
import * as fabric from 'fabric';
import ConfigurationComponent from "../ConfigurationComponent/ConfigurationComponent";
import DescriptionConfigComponent from "../DescriptionConfigComponent/DescriptionConfigComponent";
import { downloadCanvasAsPdf } from '../../utils/CanvasUtils';
import { useState } from 'react';

interface CanvusProps {
  fabricCanvasRef: React.MutableRefObject<fabric.Canvas>;
}

const ConfigurationSectionComponent : React.FC <CanvusProps> = ({fabricCanvasRef}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [canvasPreview, setCanvasPreview] = useState(null);

  const showCanvasPreview = (canvas) => {
    // Generate a preview image from the canvas
    const dataUrl = canvas.toDataURL();
    setCanvasPreview(dataUrl);
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col gap-4 max-h-full overflow-y-auto ">
      <div className="flex flex-col gap-4 max-h-full overflow-y-auto border-border-color border-b border-opacity-50">
        <ConfigurationComponent />
        <DescriptionConfigComponent />
      </div>


      <>
      <button
        onClick={() => showCanvasPreview(fabricCanvasRef.current)}
        className="w-full py-2 text-xs bg-blue-700 text-blue-50 text-blue-50 border border-border-color focus:outline-none hover:bg-blue-600 flex items-center justify-between gap-2"
      >
        <span className="flex-1 text-center">Preview</span>
        <div className="border-l border-blue-50 border-opacity-50 px-2 flex items-center">
          <AiOutlineDownload size={18} />
        </div>
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-lg w-96">
            <h2 className="text-xl mb-4">Canvas Preview</h2>
            <img src={canvasPreview} alt="Canvas Preview" className="w-full h-auto mb-4" />
            <div className="flex justify-between gap-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="py-2 px-4 bg-gray-500 text-white rounded"
              >
                Close
              </button>
              <button
                onClick={() => {
                  downloadCanvasAsPdf(fabricCanvasRef.current);
                  setIsModalOpen(false);
                }}
                className="py-2 px-4 bg-blue-700 text-white rounded"
              >
                Download
              </button>
            </div>
          </div>
        </div>
      )}
    </>



      <div className="flex ">
        <button   onClick={() => downloadCanvasAsPdf(fabricCanvasRef.current)} className="w-full py-2 text-xs bg-blue-700 text-blue-50 text-blue-50 border border-border-color focus:outline-none hover:bg-blue-600 flex items-center justify-between gap-2">
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
