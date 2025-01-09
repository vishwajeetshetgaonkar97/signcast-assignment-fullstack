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
import DesignEditComponent from "../DesignEditComponent/DesignEditComponent";
import LayersComponent from "../LayersComponent/LayersComponent";

const CanvasParentComponent = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [scale, setScale] = useState(0.5);

  useEffect(() => {
    if (canvasRef.current) {
      const initCanvas = new Canvas(canvasRef.current, {
        width: 1920,
        height: 1080,
      });
      initCanvas.backgroundColor = "#fff";
      initCanvas.renderAll();
      setCanvas(initCanvas);

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
      const objects = canvas.getObjects(); // Get all objects on the canvas
      console.log(objects); // Log or use these objects as needed
      objects.forEach((object) => {
        console.log(object.type); // Log the type of each object
      });
    }
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
      reader.readAsDataURL(file); // Read the file as a Data URL
    }
  };

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
      <div className="flex flex-row items-center justify-center">
        <button onClick={getCanvasObjects}>Get Canvas Objects</button>
      </div>
      <LayersComponent canvas={canvas} />
    </div>
  );
};

export default CanvasParentComponent;
