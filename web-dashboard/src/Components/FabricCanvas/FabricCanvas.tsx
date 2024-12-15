import React, { useRef, useEffect, useContext } from 'react';
import * as fabric from 'fabric';
import CanvasObjectsDataContext from '../../Contexts/CanvasObjectsDataContext';
import AllCanvasesObjectsDataContext from '../../Contexts/AllCanvasesObjectsDataContext';
import SelectedCanvasObjectIndexDataContext from '../../Contexts/SelectedCanvasObjectIndexDataContext';
import updateCanvas from '../../api/updateCanvas';

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
  setCanvasObjects: any;
  angle?: number;
  visible?: boolean;
}

interface LineOptions {
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
  strokeColor?: string;
  strokeWidth?: number;
  isDraggable?: boolean;
  canvas: fabric.Canvas;
  setCanvasObjects: any;
  visible?: boolean;
}


const FabricCanvas: React.FC<CanvasProps> = ({ fabricCanvasRef }) => {
  const { allcanvases, setAllCanvases } = useContext(AllCanvasesObjectsDataContext);
  const { selectedCanvasIndex } = useContext(SelectedCanvasObjectIndexDataContext);
  const { canvasObjects, setCanvasObjects } = useContext(CanvasObjectsDataContext);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const websocketRef = useRef<WebSocket | null>(null);

  const isIndexCanvasSelected = (index: number) => {
    return selectedCanvasIndex === index;
  };

  console.log("canvas local array", canvasObjects);

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

  const renderCanvasObjects = (canvasObjects, canvas) => {
    canvas.clear();
    canvasObjects.forEach(obj => {
      if (obj.visible) {
        let canvasObject;
        if (obj.type === 'rectangle') {
          canvasObject = new fabric.Rect({
            left: obj.x,
            top: obj.y,
            width: obj.width,
            height: obj.height,
            fill: obj.fillColor,
            stroke: obj.strokeColor,
            strokeWidth: obj.strokeWidth,
            selectable: obj.isDraggable,
            lockMovementX: !obj.isDraggable,
            lockMovementY: !obj.isDraggable,
            angle: obj.angle,
          });
        } else if (obj.type === 'line') {

          // need improvement angle affects positioning
          
          console.log("inside line modify",obj);

          const x1 = obj.x1 + obj.x ;
          const y1 = obj.y1 + obj.y;
          const x2 = obj.x2 + obj.x;
          const y2 = obj.y2 + obj.y;
          const angle = obj.angle;
          canvasObject = new fabric.Line([x1, y1, x2, y2], {
            stroke: obj.strokeColor,
            strokeWidth: obj.strokeWidth,
            selectable: obj.isDraggable,
            lockMovementX: !obj.isDraggable,
            lockMovementY: !obj.isDraggable,
            angle: angle,
          });
        }
        canvasObject.id = obj.id;
        canvas.add(canvasObject);
      }
    });
    canvas.renderAll();
  };
  

  useEffect(() => {
    if (canvasRef.current) {
      fabricCanvasRef.current = new fabric.Canvas(canvasRef.current);

      fabricCanvasRef.current.on('object:modified', (e) => {
        const modifiedObject = e.target;
        updateCanvasObject({
          id: modifiedObject?.id,
          x: modifiedObject?.left,
          y: modifiedObject?.top,
          width: modifiedObject?.width * modifiedObject?.scaleX,
          height: modifiedObject?.height * modifiedObject?.scaleY,
          angle: modifiedObject?.angle,
        });
      });

      renderCanvasObjects(canvasObjects, fabricCanvasRef.current);
    }

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    // Establish WebSocket connection
    websocketRef.current = new WebSocket("ws://localhost:3000");

    websocketRef.current.onopen = () => {
      console.log("WebSocket connected");
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

  useEffect(() => {
    if (fabricCanvasRef.current) {
      renderCanvasObjects(canvasObjects, fabricCanvasRef.current);
    }
  }, [canvasObjects]);

  const addRectangleToCanvas = ({
    x = 10,
    y = 10,
    width = 100,
    height = 50,
    fillColor = 'transparent',
    strokeColor = 'black',
    strokeWidth = 2,
    isDraggable = true,
    canvas,
    angle = 0,
    setCanvasObjects,
    visible = true,
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
      angle,
    });

    // Add an `id` to track objects
    rectangle.id = `rect-${canvasObjects.length + 1}`;

    canvas.add(rectangle);
    canvas.renderAll();

    // Add to the state
    setCanvasObjects((prevObjects) => [
      ...prevObjects,
      {
        id: rectangle.id,
        type: 'rectangle',
        x,
        y,
        width,
        height,
        fillColor,
        strokeColor,
        strokeWidth,
        isDraggable,
        angle,
        visible,
      },
    ]);
  };

  const addLineToCanvas = ({
    x1 = 10,
    y1 = 0,
    x2 = 100,
    y2 = 0,
    strokeColor = 'black',
    strokeWidth = 2,
    isDraggable = true,
    canvas,
    setCanvasObjects,
    visible = true,
  }: LineOptions) => {
    const line = new fabric.Line([x1, y1, x2, y2], {
      stroke: strokeColor,
      strokeWidth,
      selectable: isDraggable,
      lockMovementX: !isDraggable,
      lockMovementY: !isDraggable,
    });
  
    // Add an `id` to track objects
    line.id = `line-${canvasObjects.length + 1}`;
  
    canvas.add(line);
    canvas.renderAll();
  
    // Add to the state
    setCanvasObjects((prevObjects) => [
      ...prevObjects,
      {
        id: line.id,
        type: 'line',
        x1,
        y1,
        x2,
        y2,
        x:0,
        y:0,
        angle:0,
        strokeColor,
        strokeWidth,
        isDraggable,
        visible,
      },
    ]);
  };

  
  const handleAddRectangle = () => {
    if (fabricCanvasRef.current) {
      addRectangleToCanvas({
        canvas: fabricCanvasRef.current,
        setCanvasObjects,
      });
    }
  };

  const handleAddLine = () => {
    if (fabricCanvasRef.current) {
      addLineToCanvas({
        canvas: fabricCanvasRef.current,
        setCanvasObjects,
      });
    }
  };
  
  const handleSyncCanvas = async () => {
    const updateCanvasPostBody = {
      canvasId: allcanvases[selectedCanvasIndex]._id,
      name: allcanvases[selectedCanvasIndex].name,
      category: allcanvases[selectedCanvasIndex].category,
      data: canvasObjects,
    }

    try {
      const log = await updateCanvas(updateCanvasPostBody);
      console.log("log addition ", log);
    } catch (error) {
      console.log(`canvas get issue ${error}`);
    }
  }

  return (
    <div ref={containerRef} className="h-full w-[80%]">
      <canvas ref={canvasRef} className="border border-gray-300 h-full w-full" />
      <div>
        {allcanvases.map((canvas, index) => (
          <div
            key={index}
            className={`p-2 border border-gray-300 w-fit cursor-pointer ${isIndexCanvasSelected(index) ? 'bg-gray-200' : ''}`}
          >
            {canvas.name}
          </div>
        ))}
      </div>
      <button onClick={handleAddRectangle}>Add Rectangle</button>
      <button onClick={handleAddLine}>Add Line</button>
      <button onClick={handleSyncCanvas}>Sync</button>
    </div>
  );
};

export default FabricCanvas;
