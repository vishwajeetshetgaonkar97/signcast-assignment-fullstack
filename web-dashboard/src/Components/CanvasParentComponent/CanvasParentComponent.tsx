import React, { useRef, useState, useEffect } from "react";
import { Canvas , Rect, Circle, Text, Line } from "fabric";
import * as fabric from "fabric";
import { FaRegSquare } from "react-icons/fa";
import { FaRegCircle } from "react-icons/fa";
import DesignEditComponent from "../DesignEditComponent/DesignEditComponent";

const CanvasParentComponent = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);

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
      const rect = new Circle({
        top: 100,
        left: 50,
        radius: 50,
        fill: "#0000FF",
      });
      canvas.add(rect);
    }
  };

  return (
    <div className={"flex items-center justify-center "}>
      <div className="flex flex-row w-min gap-3 absolute z-10 top-12 left-1/2 transform -translate-x-1/2 bg-bg-color  py-2 px-3 rounded shadow">
        <FaRegSquare className=" cursor-pointer hover:text-violet-700" onClick={addRectangle} size={20} />
        <FaRegCircle className=" cursor-pointer hover:text-fuchsia-500" onClick={addCircle} size={20} />
      </div>
      <canvas id="canvas" ref={canvasRef} />
      <DesignEditComponent canvas={canvas} />
    </div>
  );
}

export default CanvasParentComponent