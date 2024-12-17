import { AiOutlineDownload } from 'react-icons/ai';
import { downloadCanvasAsPdf } from '../../utils/CanvasUtils';
import * as fabric from 'fabric';
import AddingToCanvasComponent from '../AddingToCanvasComponent/AddingToCanvasComponent';
import RenderCanvasElementsComponent from '../RenderCanvasElementsComponent/RenderCanvasElementsComponent';

interface CanvasProps {
  fabricCanvasRef: React.MutableRefObject<fabric.Canvas>;
}

const ConfigurationSectionComponent: React.FC<CanvasProps> = ({ fabricCanvasRef }) => {


  return (
    <div className="flex flex-col gap-4 max-h-full overflow-y-auto w-[20%]">

      <AddingToCanvasComponent fabricCanvasRef={fabricCanvasRef} />
      <RenderCanvasElementsComponent />

      <div className="flex  flex-col gap-1">
        <button
          onClick={() => downloadCanvasAsPdf(fabricCanvasRef.current)}
          className="w-full py-2 text-xs bg-blue-700 text-blue-50 border border-border-color focus:outline-none hover:bg-blue-600 flex items-center justify-between gap-2"
        >
          <span className="flex-1 text-center">Download</span>
          <div className="border-l border-blue-50 border-opacity-50 px-2 flex items-center">
            <AiOutlineDownload size={18} />
          </div>
        </button>
        <h6 className=" text-[9px] opacity-80 text-yellow-700">Note: Might not work with slideshow.</h6>
    
      </div>
     
    </div>
  );
};

export default ConfigurationSectionComponent;
