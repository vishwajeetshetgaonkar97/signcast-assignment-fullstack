import React, { useRef, useState, useEffect } from "react";
import { Canvas, Rect, Circle, Text, Triangle } from "fabric";
import * as fabric from "fabric";
import { FaRegSquare } from "react-icons/fa";
import { FaRegCircle } from "react-icons/fa";
import { RxText } from "react-icons/rx";
import { LuTriangle } from "react-icons/lu";
import { FiZoomIn } from "react-icons/fi";
import { FiZoomOut } from "react-icons/fi";
import { MdOutlineImage } from "react-icons/md";
import { GrAdd } from "react-icons/gr";
import DesignEditComponent from "../DesignEditComponent/DesignEditComponent";
import LayersComponent from "../LayersComponent/LayersComponent";
import addCanvas from "../../api/addCanvas";
import getCanvases from "../../api/getCanvases";

const CanvasParentComponent = () => {
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

  const addRectangle = () => {
    if (canvas) {
      const rect = new Rect({
        top: 100,
        left: 50,
        width: 100,
        height: 60,
        fill: "#FF0000",
      });
      canvas.add(rect);
    }
  };

  const addCircle = () => {
    if (canvas) {
      const circle = new Circle({
        top: 100,
        left: 50,
        radius: 50,
        fill: "#0000FF",
      });
      canvas.add(circle);
    }
  };

  const addText = () => {
    if (canvas) {
      const text = new Text("Hello World", {
        top: 100,
        left: 50,
        fontSize: 24,
        fill: "#000000",
      });
      canvas.add(text);
    }
  };

  const addTriangle = () => {
    if (canvas) {
      const triangle = new Triangle({
        top: 100,
        left: 50,
        width: 80,
        height: 80,
        fill: "#00FF00",
      });
      canvas.add(triangle);
    }
  };

  const zoomIn = () => {
    setScale((prevScale) => prevScale * 1.1);
  };

  const zoomOut = () => {
    setScale((prevScale) => prevScale / 1.1);
  };

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

  const uploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && canvas) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imgObj = new Image();
        imgObj.src = event.target?.result as string;
        imgObj.onload = () => {
          const fabricImage = new fabric.Image(imgObj);
          fabricImage.set({
            left: 100,
            top: 100,
            scaleX: 0.5,
            scaleY: 0.5,
          });
          canvas.add(fabricImage);
        };
      };
      reader.readAsDataURL(file);
    }
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
        //  setAllCanvases(data.canvases);
        setAllCanvases((prev) => [...prev, postData]);
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

  const handleScreenChange = (index: number) => {
    if (canvas) {
      const currentObjects = canvas.getObjects();

      setAllCanvases((prev) =>
        prev.map((canvasData, idx) =>
          idx === selectedCanvasIndex
            ? { ...canvasData, data: currentObjects }
            : canvasData
        )
      );

      const selectedCanvasData = allcanvases[index].data;

      const canvasBgColor = canvas.backgroundColor;

      canvas.clear();
      canvas.add(...selectedCanvasData);
      canvas.backgroundColor = canvasBgColor;
      setSelectedCanvasIndex(index);
      canvas.renderAll();
    }
  };

  console.log("allcanvases", allcanvases);

  return (
    <div className={"flex items-center justify-center "}  >
      <div className="flex flex-row w-min gap-3 absolute z-10 top-12 left-1/2 transform -translate-x-1/2 bg-bg-color py-2 px-3 rounded shadow">
        <FaRegSquare className="cursor-pointer hover:text-violet-700" onClick={addRectangle} size={20} />
        <FaRegCircle className="cursor-pointer hover:text-fuchsia-500" onClick={addCircle} size={20} />
        <LuTriangle className="cursor-pointer hover:text-green-500" onClick={addTriangle} size={20} />
        <RxText className="cursor-pointer hover:text-blue-500" onClick={addText} size={20} />

        <label htmlFor="fileUpload" className="cursor-pointer hover:text-rose-500">
          <MdOutlineImage size={20} />
        </label>

        <input
          id="fileUpload"
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={uploadImage}
        />
      </div>

      <div className="flex flex-row align-center justify-center w-min gap-2 absolute z-10 bottom-2 right-2 bg-bg-color py-2 px-3 rounded shadow">

        <FiZoomIn className="cursor-pointer hover:text-fuchsia-700 mt-1" onClick={zoomIn} size={18} />
        <FiZoomOut className="cursor-pointer hover:text-rose-500 mt-1" onClick={zoomOut} size={18} />

        <div className="flex flex-row items-center group transition duration-300 ease-in-out pr-2">
          <input
            className="text-xs w-12 border border-border-color bg-bg-color rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="number"
            value={scale * 100}
            onChange={(e) => setScale(parseFloat(e.target.value) / 100)}
          />
          <span className="text-xs opacity-80 ml-[-18px] group-hover:ml-2">%</span>
        </div>

      </div>

      <div className={"flex items-center justify-center "} style={{ transform: `scale(${scale})` }}>
        <canvas id="canvas" ref={canvasRef} />
      </div>


      <DesignEditComponent canvas={canvas} />
      <div className="flex flex-row items-center justify-center absolute z-10 bottom-2 left-2 ">
        <button onClick={getCanvasObjects}>Get Canvas Objects</button>
      </div>
      <LayersComponent canvas={canvas} />

      <div className="flex flex-row w-fit align-center justify-center gap-1 absolute z-10 bottom-2 left-1/2 transform -translate-x-1/2 bg-bg-color py-2 px-3 rounded shadow">
        {
          allcanvases.map((canvas, index) => (
            <div key={index}
              onClick={() => handleScreenChange(index)}
              className={`cursor-pointer text-xs p-2 w-min min-w-[80px] hover:bg-card-color rounded ${index === selectedCanvasIndex ? 'bg-orange-500 text-white hover:bg-orange-600' : ''}`}>
              {canvas.name}
            </div>
          ))

        }
        <div className="cursor-pointer text-xs w-min hover:text-violet-700 p-2 bg-card-color rounded px-3" onClick={() => setIsModalOpen(true)}>
          <GrAdd />
        </div>
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
  );
};

export default CanvasParentComponent;
