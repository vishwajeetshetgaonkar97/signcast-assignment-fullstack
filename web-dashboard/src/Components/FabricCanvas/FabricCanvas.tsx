import React, { useRef, useEffect, useState, useContext } from 'react';
import * as fabric from 'fabric';
import CanvasObjectsDataContext from '../../Contexts/CanvasObjectsDataContext';
import { addRectangleToCanvas } from '../../utils/CanvasDrawingsUtils';

interface CanvasProps {
  fabricCanvasRef: React.MutableRefObject<fabric.Canvas | null>;
}



const FabricCanvas: React.FC<CanvasProps> = ({ fabricCanvasRef }) => {
  const { canvasObjects, setCanvasObjects } = useContext(CanvasObjectsDataContext)
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const websocketRef = useRef<WebSocket | null>(null);

  console.log("canvas local array", canvasObjects)
  const initializeCanvas = () => {
    if (canvasRef.current && !fabricCanvasRef.current) {
      fabricCanvasRef.current = new fabric.Canvas(canvasRef.current, {
        preserveObjectStacking: true,
        selection: true,
        backgroundColor: 'white',
      });

      fabric.Text.prototype.fontFamily = 'Poppins';

      fabricCanvasRef.current.on('object:modified', (e) => {
        if (e.target) {
          updateCanvasObject({
            id: e.target.id, // Assuming objects have an `id` property
            left: e.target.left,
            top: e.target.top,
            scaleX: e.target.scaleX,
            scaleY: e.target.scaleY,
            angle: e.target.angle,
            width: e.target.width,
            height: e.target.height,
          });
        }
      });

      fabricCanvasRef.current.on('object:moving', (e) => {
        if (e.target) {
          updateCanvasObject({
            id: e.target.id,
            left: e.target.left,
            top: e.target.top,
          });
        }
      });
    }
  };

  const updateCanvasSize = () => {
    if (containerRef.current && fabricCanvasRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const newHeight = (containerWidth * 9) / 16;
      const canvas = fabricCanvasRef.current;
      const prevWidth = canvas.width || 1;
      const prevHeight = canvas.height || 1;

      canvas.setWidth(containerWidth);
      canvas.setHeight(newHeight);

      const scaleX = containerWidth / prevWidth;
      const scaleY = newHeight / prevHeight;

      canvas.getObjects().forEach((obj) => {
        obj.scaleX = (obj.scaleX || 1) * scaleX;
        obj.scaleY = (obj.scaleY || 1) * scaleY;
        obj.left = (obj.left || 0) * scaleX;
        obj.top = (obj.top || 0) * scaleY;
        obj.setCoords();
      });
      canvas.renderAll();
    }
  };



  const updateCanvasObject = (updatedObject: any) => {
    setCanvasObjects((prevObjects) =>
      prevObjects.map((obj) =>
        obj.id === updatedObject.id ? { ...obj, ...updatedObject } : obj
      )
    );
  };

  const sendCanvasObjectData = (data: any) => {
    if (websocketRef.current && websocketRef.current.readyState === WebSocket.OPEN) {
      websocketRef.current.send(JSON.stringify(data));
    }
  };

  useEffect(() => {
    initializeCanvas();
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    // Establish WebSocket connection
    websocketRef.current = new WebSocket("ws://localhost:3000");

    websocketRef.current.onopen = () => {
      console.log("WebSocket connected");
    };

    websocketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (fabricCanvasRef.current) {
        const canvas = fabricCanvasRef.current;
        switch (data.type) {
          case "addRectangle":
            addRectangleToCanvas({
              x: data.object.x,
              y: data.object.y,
              width: data.object.width,
              height: data.object.height,
              fillColor: data.object.fillColor,
              strokeColor: data.object.strokeColor,
              strokeWidth: data.object.strokeWidth,
              isDraggable: data.object.isDraggable,
              canvas: fabricCanvasRef.current,
              setCanvasObjects: sendCanvasObjectData,
            });
            break;
          // Handle other cases if needed
        }
      }
    };

    websocketRef.current.onclose = () => {
      console.log("WebSocket disconnected");
    };

    websocketRef.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.dispose();
        fabricCanvasRef.current = null;
      }

      // Close WebSocket connection
      if (websocketRef.current) {
        websocketRef.current.close();
      }
    };
  }, []);

  return (
    <div ref={containerRef} className="h-full w-full">
      <canvas ref={canvasRef} className="border border-gray-300 h-full w-full" />
    
    </div>
  );
};

export default FabricCanvas;
