import React, { useContext } from "react";
import { Canvas } from "fabric";
import { GrAdd } from "react-icons/gr";
import SelectedCanvasObjectIndexDataContext from "../../Contexts/SelectedCanvasObjectIndexDataContext";
import AllCanvasesDataContext from "../../Contexts/AllCanvasesDataContext";

interface CanvasScreensComponentProps {
    canvas: Canvas;
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    handleScreenChange: (index: number) => void;
}

const CanvasScreensComponent: React.FC<CanvasScreensComponentProps> = ({
    setIsModalOpen,
    handleScreenChange,
}) => {

    const { allcanvases, setAllCanvases } = useContext(AllCanvasesDataContext)
    const { selectedCanvasIndex, setSelectedCanvasIndex } = useContext(SelectedCanvasObjectIndexDataContext)

 

    return (
        <div className="flex flex-row w-fit align-center justify-center gap-1 absolute z-10 bottom-2 left-1/2 transform -translate-x-1/2 bg-bg-color py-2 px-3 rounded shadow">
            {allcanvases.map((canvasData, index) => (
                <div
                    key={index}
                    onClick={() => handleScreenChange(index)}
                    className={`cursor-pointer text-center text-xs p-2 w-min min-w-[80px] hover:bg-card-color rounded ${index === selectedCanvasIndex ? "bg-orange-500 text-white hover:bg-orange-600" : ""
                        }`}
                >
                    {canvasData.name}
                </div>
            ))}
            <div
                className="cursor-pointer text-xs w-min hover:text-violet-700 p-2 bg-card-color rounded px-3"
                onClick={() => setIsModalOpen(true)}
            >
                <GrAdd />
            </div>
        </div>
    );
};

export default CanvasScreensComponent;
