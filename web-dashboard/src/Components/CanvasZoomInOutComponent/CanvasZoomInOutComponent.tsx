import React from "react";
import { FiZoomIn, FiZoomOut } from "react-icons/fi";

interface CanvasZoomInOutComponentProps {
  scale: number;
  setScale: React.Dispatch<React.SetStateAction<number>>;
}

const CanvasZoomInOutComponent: React.FC<CanvasZoomInOutComponentProps> = ({ scale, setScale }) => {
  const zoomIn = () => {
    setScale((prevScale) => prevScale * 1.1);
  };

  const zoomOut = () => {
    setScale((prevScale) => prevScale / 1.1);
  };

  return (
    <div className="flex flex-row align-center justify-center w-min gap-2 absolute z-10 bottom-2 right-2 bg-bg-color py-2 px-3 rounded shadow">
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
