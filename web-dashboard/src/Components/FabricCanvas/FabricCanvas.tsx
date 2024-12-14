import React, { useRef, useEffect, useContext } from 'react';
import * as fabric from 'fabric';
import CanvasObjectsDataContext from '../../Contexts/CanvasObjectsDataContext';
import { addRectangleToCanvas, addLineToCanvas, addImageToCanvas } from '../../utils/CanvasDrawingsUtils';

interface CanvasProps {
  fabricCanvasRef: React.MutableRefObject<fabric.Canvas | null>;
}

const FabricCanvas: React.FC<CanvasProps> = ({ fabricCanvasRef }) => {
  const { canvasObjects, setCanvasObjects } = useContext(CanvasObjectsDataContext);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const websocketRef = useRef<WebSocket | null>(null);


  console.log("canvas local array", canvasObjects);

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
          console.log("on move", e.target);
          updateCanvasObject({
            id: e.target.id,
            left: e.target.left,
            top: e.target.top,
            angle: e.target.angle,
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

  const renderCanvasObjects = () => {
    if (fabricCanvasRef.current) {
      console.log("canvassssss render objjjjj", canvasObjects)
      canvasObjects.forEach((obj) => {
        switch (obj.type) {
          case 'rectangle':
            addRectangleToCanvas({
              x: obj.x,
              y: obj.y,
              width: obj.width,
              height: obj.height,
              fillColor: obj.fillColor,
              strokeColor: obj.strokeColor,
              strokeWidth: obj.strokeWidth,
              isDraggable: obj.isDraggable,
              canvas: fabricCanvasRef.current,
              angle: obj.angle,
              setCanvasObjects: setCanvasObjects,
            });
            break;
          case 'line':
            addLineToCanvas({
              startX: obj.startX,
              startY: obj.startY,
              scaleX: obj.scaleX,
              scaleY: obj.scaleY,
              length: obj.length,
              angle: obj.angle,
              top: obj.top,
              left: obj.left,
              strokeColor: obj.strokeColor,
              strokeWidth: obj.strokeWidth,
              isDraggable: obj.isDraggable,
              canvas: fabricCanvasRef.current,
              setCanvasObjects: setCanvasObjects,
            });
            break;
          case 'image':
            addImageToCanvas({
              imageUrl: obj.imageUrl,
              canvas: fabricCanvasRef.current,
              setCanvasObjects: setCanvasObjects,
              x: obj.x,
              y: obj.y,
              scaleFactor: obj.scaleFactor,
              isDraggable: obj.isDraggable,
            });
            break;
          default:
            break;
        }
      });
    }
  };

  useEffect(() => {
    initializeCanvas();
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    // Render existing canvas objects
    renderCanvasObjects();

    // Establish WebSocket connection
    websocketRef.current = new WebSocket("ws://localhost:3000");

    websocketRef.current.onopen = () => {
      console.log("WebSocket connected");
    };

    
    websocketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (fabricCanvasRef.current) {
        switch (data.type) {
          case "addRectangle":
            addRectangleToCanvas({
              x: data.object.top,
              y: data.object.left,
              width: data.object.width,
              height: data.object.height,
              fillColor: data.object.fillColor,
              strokeColor: data.object.strokeColor,
              strokeWidth: data.object.strokeWidth,
              isDraggable: data.object.isDraggable,
              canvas: fabricCanvasRef.current,
              angle: data.object.angle,
              setCanvasObjects: sendCanvasObjectData,
            });
            break;
          case "addLine":
            addLineToCanvas({
              startX: data.object.startX,
              startY: data.object.startY,
              length: data.object.length,
              angle: data.object.angle,
              strokeColor: data.object.strokeColor,
              strokeWidth: data.object.strokeWidth,
              isDraggable: data.object.isDraggable,
              canvas: fabricCanvasRef.current,
              setCanvasObjects: sendCanvasObjectData,
            });
            break;
          case "addImage":
            addImageToCanvas({
              imageUrl: data.object.imageUrl,
              canvas: fabricCanvasRef.current,
              setCanvasObjects: sendCanvasObjectData,
              x: data.object.top,
              y: data.object.left,
              scaleFactor: data.object.scaleFactor,
              isDraggable: data.object.isDraggable,
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
