import React from "react";
import { FiZoomIn, FiZoomOut } from "react-icons/fi";
import { MdFullscreen } from "react-icons/md";
import { MdFullscreenExit } from "react-icons/md";
import FullScreenStateContext from "../../Contexts/FullScreenStateContext";

interface CanvasZoomInOutComponentProps {
  scale: number;
  setScale: React.Dispatch<React.SetStateAction<number>>;
}

const CanvasZoomInOutComponent: React.FC<CanvasZoomInOutComponentProps> = ({ scale, setScale }) => {

  const { isFullScreen, setIsFullScreen } = React.useContext(FullScreenStateContext);
  const zoomIn = () => {
    setScale((prevScale) => prevScale * 1.1);
  };

  const zoomOut = () => {
    setScale((prevScale) => prevScale / 1.1);
  };

  const toggleFullScreen = () => {
    if (isFullScreen) {
      document.exitFullscreen();
      setIsFullScreen(false);
      setScale(0.6);
    } else {
      document.documentElement.requestFullscreen();
      setIsFullScreen(true);
      setScale(1);
    }
  };
 
  return (
    <div className={`flex flex-row align-center justify-center w-min gap-2 absolute z-10 bottom-2 right-2 bg-bg-color py-2 px-3 rounded shadow ${isFullScreen ? "opacity-0 hover:opacity-100 transition duration-1000 ease-in-out " : ""} `}>
      {isFullScreen ? <MdFullscreenExit onClick={toggleFullScreen}  className="cursor-pointer hover:text-rose-500 mt-1" size={20} /> :
        <MdFullscreen onClick={toggleFullScreen} className="cursor-pointer hover:text-fuchsia-700 mt-1" size={20} />}

      <FiZoomIn className="cursor-pointer hover:text-fuchsia-700 mt-1" onClick={zoomIn} size={18} />
      <FiZoomOut className="cursor-pointer hover:text-rose-500 mt-1" onClick={zoomOut} size={18} />

      <div className="flex flex-row items-center group transition duration-300 ease-in-out pr-2">
        <input
          className="text-xs w-12 border border-border-color bg-bg-color rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="number"
          value={scale * 100}  // Display as percentage
          onChange={(e) => setScale(parseFloat(e.target.value) / 100)} // Convert to scale
        />
        <span className="text-xs opacity-80 ml-[-18px] group-hover:ml-2">%</span>
      </div>
    </div>
  );
};

export default CanvasZoomInOutComponent;
