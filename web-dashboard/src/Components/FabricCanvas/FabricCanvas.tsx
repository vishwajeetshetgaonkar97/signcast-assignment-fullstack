import React, { useRef, useEffect, useState, useContext } from 'react';
import * as fabric from 'fabric';
import SelectedConfigurationContext from '../../Contexts/SelectedConfigurationContext';
import AdditionalConfigurationContext from '../../Contexts/AdditionalConfigurationContext';
import DescriptionDataContext from '../../Contexts/DescripotionDataContext';

interface CanvasProps {
  fabricCanvasRef: React.MutableRefObject<fabric.Canvas | null>;
}


interface RectangleOptions {
  x?: number;
  y?: number;
  width?: number; 
  height?: number;
  fillColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
  isDraggable?: boolean;
  canvas: fabric.Canvas;
}

interface LineOptions {
  length?: number;
  color?: string;
  strokeWidth?: number;
  orientation?: 'horizontal' | 'vertical';
  canvas: fabric.Canvas;
  x?: number;
  y?: number;
}

interface ImageOptions {
  imageUrl: string;
  x?: number;
  y?: number;
  scaleFactor?: number;
  isDraggable?: boolean;
  canvas: fabric.Canvas;
}

const FabricCanvas: React.FC<CanvasProps> = ({ fabricCanvasRef }) => {
  const { selectedConfiguration } = useContext(SelectedConfigurationContext);
  const { additionalConfiguration } = useContext(AdditionalConfigurationContext);
  const { descriptionConfiguration } = useContext(DescriptionDataContext);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const websocketRef = useRef<WebSocket | null>(null);
  const [selectedConfigValues, setSelectedConfigValues] = useState(selectedConfiguration);

  useEffect(() => {
    setSelectedConfigValues(selectedConfiguration);
  }, [selectedConfiguration]);

  const initializeCanvas = () => {
    if (canvasRef.current && !fabricCanvasRef.current) {
      fabricCanvasRef.current = new fabric.Canvas(canvasRef.current, {
        preserveObjectStacking: true,
        selection: true,
        backgroundColor: 'white',
      });

      fabric.Text.prototype.fontFamily = 'Poppins';
      
      // Add event listener for object modifications
      fabricCanvasRef.current.on('object:modified', (e) => {
        if (e.target) {
          sendCanvasObjectData({
            type: 'updateObject',
            object: {
              id: e.target.id, // Assuming objects have an `id` property
              left: e.target.left,
              top: e.target.top,
              scaleX: e.target.scaleX,
              scaleY: e.target.scaleY,
              angle: e.target.angle,
            },
          });
        }
      });

      fabricCanvasRef.current.on('object:moving', (e) => {
        if (e.target) {
          sendCanvasObjectData({
            type: 'moveObject',
            object: {
              id: e.target.id, // Assuming objects have an `id` property
              left: e.target.left,
              top: e.target.top,
            },
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

  const addRectangle = ({ x = 10, y = 10, width = 100, height = 50, fillColor = 'transparent', strokeColor = 'black', strokeWidth = 2, isDraggable = true, canvas, }: RectangleOptions) => {
    const rectangle = new fabric.Rect({
      left: x,
      top: y,
      width,
      height,
      fill: fillColor,
      stroke: strokeColor,
      strokeWidth,
      selectable: isDraggable,
      lockMovementX: !isDraggable,
      lockMovementY: !isDraggable,
    });

    // Add an `id` to track objects
    rectangle.id = `rect-${Date.now()}`;

    canvas.add(rectangle);
    canvas.renderAll();

    // Send rectangle data via WebSocket
    sendCanvasObjectData({
      type: 'addRectangle',
      object: {
        id: rectangle.id,
        x,
        y,
        width,
        height,
        fillColor,
        strokeColor,
        strokeWidth,
        isDraggable,
      },
    });
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
            addRectangle({
              x: data.object.x,
              y: data.object.y,
              width: data.object.width,
              height: data.object.height,
              fillColor: data.object.fillColor,
              strokeColor: data.object.strokeColor,
              strokeWidth: data.object.strokeWidth,
              isDraggable: data.object.isDraggable,
              canvas,
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
      <div className="flex justify-center items-center gap-2 pt-2">
        <button
          onClick={() => {
            if (fabricCanvasRef.current) {
              addRectangle({ canvas: fabricCanvasRef.current });
            }
          }}
          className="btn-primary"
        >
          Add Rectangle
        </button>
      </div>
    </div>
  );
};

export default FabricCanvas;
