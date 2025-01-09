import React, { useRef, useState, useEffect, useMemo } from "react";
import { Canvas } from "fabric";
import * as fabric from "fabric";
import DesignEditComponent from "../DesignEditComponent/DesignEditComponent";
import LayersComponent from "../LayersComponent/LayersComponent";
import addCanvas from "../../api/addCanvas";
import getCanvases from "../../api/getCanvases";
import AddToCanvasComponent from "../AddToCanvasComponents/AddToCanvasComponent";
import CanvasZoomInOutComponent from "../CanvasZoomInOutComponent/CanvasZoomInOutComponent";
import CanvasScreensComponent from "../CanvasScreensComponent/CanvasScreensComponent";
import SelectedCanvasObjectIndexDataContext from "../../Contexts/SelectedCanvasObjectIndexDataContext";
import AllCanvasesDataContext from "../../Contexts/AllCanvasesDataContext";


const CanvasParentComponent: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [scale, setScale] = useState(0.5);
  const [allcanvases, setAllCanvases] = useState<any[]>([]);
  const [selectedCanvasIndex, setSelectedCanvasIndex] = useState<number>(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCanvasName, setNewCanvasName] = useState('');
  const [newCanvasCategory, setNewCanvasCategory] = useState('');


  const getAllCanvases = async () => {
    try {
      const data = await getCanvases();
      console.log('canvases', data.canvases);
      setAllCanvases(data.canvases);
    } catch (error) {
      console.log(`canvas get issue ${error}`);
    }
  };

  useEffect(() => {
    if (canvasRef.current) {
      const initCanvas = new Canvas(canvasRef.current, {
        width: 1920,
        height: 1080,
      });
      initCanvas.backgroundColor = "#fff";
      initCanvas.renderAll();
      setCanvas(initCanvas);
      getAllCanvases();

      return () => {
        initCanvas.dispose();
      };
    }
  }, []);



  const getCanvasObjects = () => {
    if (canvas) {
      const objects = canvas.getObjects();
      console.log(objects);
      objects.forEach((object) => {
        console.log(object.type);
      });
      return objects;
    }
    return [];
  };




  const handleAddCanvas = async () => {
    try {
      if (newCanvasName.trim() && newCanvasCategory) {

        const postData = {
          name: newCanvasName,
          category: newCanvasCategory,
          data: [],
        };
        await addCanvas(postData);
        const data = await getCanvases();
        console.log("dataaa canvass", data);
        setAllCanvases(data.canvases);
        setIsModalOpen(false);
        return
      }

      alert('Please provide both a name and a category for the canvas.');
    } catch (error) {
      console.log(`canvas get issue ${error}`);
      alert('Error');
      setIsModalOpen(false);
    }
  }

  const allCanvasDataContextValue = useMemo(
    () => ({ allcanvases, setAllCanvases }),
    [allcanvases, setAllCanvases]
  );


  const selectedCanvasIndexContextValue = useMemo(
    () => ({ selectedCanvasIndex, setSelectedCanvasIndex }),
    [selectedCanvasIndex, setSelectedCanvasIndex]
  );



  console.log("allcanvases", allcanvases);

  return (
    <AllCanvasesDataContext.Provider value={allCanvasDataContextValue}>
      <SelectedCanvasObjectIndexDataContext.Provider value={selectedCanvasIndexContextValue}>

        <>
          <div className={"flex items-center justify-center "}  >

            <div className={"flex items-center justify-center "} style={{ transform: `scale(${scale})` }}>
              <canvas id="canvas" ref={canvasRef} />
            </div>


            <AddToCanvasComponent canvas={canvas} />
            <CanvasZoomInOutComponent scale={scale} setScale={setScale} />
            <DesignEditComponent canvas={canvas} />
            <LayersComponent canvas={canvas} />

            <CanvasScreensComponent canvas={canvas}
              setIsModalOpen={setIsModalOpen}
            />



            <div className="flex flex-row items-center justify-center absolute z-10 bottom-2 left-2 ">
              <button onClick={getCanvasObjects}>Get Canvas Objects</button>
            </div>


            {isModalOpen && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white p-6 shadow-lg">
                  <h2 className="text-lg font-semibold mb-4">Add New Canvas</h2>
                  <input
                    type="text"
                    placeholder="Canvas Name"
                    value={newCanvasName}
                    onChange={(e) => setNewCanvasName(e.target.value)}
                    className="w-full mb-4 px-3 py-2 border "
                  />
                  <select
                    value={newCanvasCategory}
                    onChange={(e) => setNewCanvasCategory(e.target.value)}
                    className="w-full mb-4 px-3 py-2 border "
                  >
                    <option value="">Select Category</option>
                    <option value="General">General</option>
                    <option value="Special">Special</option>
                    <option value="Preffered">Preffered</option>
                  </select>
                  <div className="flex justify-end gap-4">
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddCanvas}
                      className="bg-blue-700 text-white px-4 py-2 hover:bg-blue-600"
                    >
                      Add Canvas
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        </>
      </SelectedCanvasObjectIndexDataContext.Provider>
    </AllCanvasesDataContext.Provider>
  );
};

export default CanvasParentComponent;
