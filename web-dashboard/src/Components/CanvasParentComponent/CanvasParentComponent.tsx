import React, { useRef, useState, useEffect } from "react";
import { Canvas, Rect, Circle, Text, Triangle } from "fabric";
import * as fabric from "fabric";
import { FaRegSquare } from "react-icons/fa";
import { FaRegCircle } from "react-icons/fa";
import { RxText } from "react-icons/rx";
import { LuTriangle } from "react-icons/lu";
import { FiZoomIn } from "react-icons/fi";
import { FiZoomOut } from "react-icons/fi";
import DesignEditComponent from "../DesignEditComponent/DesignEditComponent";

const CanvasParentComponent = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [scale, setScale] = useState(0.8);

  useEffect(() => {
    if (canvasRef.current) {
      const initCanvas = new Canvas(canvasRef.current, {
        width: 1280,
        height: 720,
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

  return (
    <div className={"flex items-center justify-center "}  >
      <div className="flex flex-row w-min gap-3 absolute z-10 top-12 left-1/2 transform -translate-x-1/2 bg-bg-color py-2 px-3 rounded shadow">
        <FaRegSquare className="cursor-pointer hover:text-violet-700" onClick={addRectangle} size={20} />
        <FaRegCircle className="cursor-pointer hover:text-fuchsia-500" onClick={addCircle} size={20} />
        <LuTriangle className="cursor-pointer hover:text-green-500" onClick={addTriangle} size={20} />
        <RxText className="cursor-pointer hover:text-blue-500" onClick={addText} size={20} />
      </div>

      <div className="flex flex-row align-center justify-center w-min gap-2 absolute z-10 bottom-2 right-2 bg-bg-color py-2 px-3 rounded shadow">

        <FiZoomIn className="cursor-pointer hover:text-fuchsia-700 mt-1" onClick={zoomIn} size={18} />
        <FiZoomOut className="cursor-pointer hover:text-rose-500 mt-1" onClick={zoomOut} size={18} />

        <div className="flex flex-row items-center group transition duration-300 ease-in-out">
          <input
            className="text-xs w-12 border rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
    </div>
  );
};

export default CanvasParentComponent;
