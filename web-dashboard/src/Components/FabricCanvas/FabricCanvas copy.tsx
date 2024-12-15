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

  const addRectangle = ({
    x = 10,
    y = 10,
    width = 100,
    height = 50,
    fillColor = 'transparent',
    strokeColor = 'black',
    strokeWidth = 2,
    isDraggable = true,
    canvas,
  }: RectangleOptions) => {
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
    canvas.add(rectangle);
    canvas.renderAll();
  };

  const addLine = ({
    length = 200,
    color = 'black',
    strokeWidth = 2,
    orientation = 'horizontal',
    canvas,
    x = 10,
    y = 10,
  }: LineOptions) => {
    const points = orientation === 'horizontal' ? [x, y, x + length, y] : [x, y, x, y + length];
    const line = new fabric.Line(points, {
      stroke: color,
      strokeWidth,
      selectable: true,
    });
    canvas.add(line);
    canvas.renderAll();
  };

  const addImage = ({
    imageUrl,
    x = 10,
    y = 10,
    scaleFactor = 1,
    isDraggable = true,
    canvas,
  }: ImageOptions) => {
    const imgElement = new Image();
    imgElement.onload = () => {
      const imgInstance = new fabric.Image(imgElement, {
        left: x,
        top: y,
        scaleX: scaleFactor,
        scaleY: scaleFactor,
        selectable: isDraggable,
      });
      canvas.add(imgInstance);
      canvas.renderAll();
    };
    imgElement.src = imageUrl;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && fabricCanvasRef.current) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result?.toString();
        if (dataUrl) {
          addImage({ imageUrl: dataUrl, canvas: fabricCanvasRef.current });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    initializeCanvas();
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.dispose();
        fabricCanvasRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3000");
  
    ws.onopen = () => {
      console.log("WebSocket connected");
    };
  
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (fabricCanvasRef.current) {
        const canvas = fabricCanvasRef.current;
        if (data.type === "addRectangle") {
          addRectangle({
            x: data.x,
            y: data.y,
            width: data.width,
            height: data.height,
            fillColor: data.fillColor,
            strokeColor: data.strokeColor,
            strokeWidth: data.strokeWidth,
            isDraggable: data.isDraggable,
            canvas,
          });
        }
      }
    };
  
    ws.onclose = () => {
      console.log("WebSocket disconnected");
    };
  
    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
  
    return () => {
      ws.close();
    };
  }, []);
  
  // Send data to WebSocket
  const sendRectangleData = (rectangle) => {
    const ws = new WebSocket("ws://localhost:3000");
    ws.onopen = () => {
      const data = {
        type: "addRectangle",
        x: rectangle.left,
        y: rectangle.top,
        width: rectangle.width,
        height: rectangle.height,
        fillColor: rectangle.fill,
        strokeColor: rectangle.stroke,
        strokeWidth: rectangle.strokeWidth,
        isDraggable: !rectangle.lockMovementX,
      };
      ws.send(JSON.stringify(data));
    };
  };

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
        <button
          onClick={() => {
            if (fabricCanvasRef.current) {
              addLine({ canvas: fabricCanvasRef.current });
            }
          }}
          className="btn-primary"
        >
          Add Line
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          style={{ display: 'none' }}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="btn-primary"
        >
          Upload Image
        </button>
      </div>
    </div>
  );
};

export default FabricCanvas;



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